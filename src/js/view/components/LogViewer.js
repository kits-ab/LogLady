/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import {
  LogViewerRootContainer,
  LogViewerContainer
} from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import CustomScrollBar from './CustomScrollBar';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
import { fetchTextBasedOnByteFromScrollPosition } from './helpers/logHelper';
import {
  handleTailSwitch,
  updateScrollPosition
} from '../actions/dispatchActions';
import _ from 'lodash';

const debouncedFetchTextByBytePosition = _.debounce(
  (path, bytesToRead, nrOfLines) => {
    fetchTextBasedOnByteFromScrollPosition(
      path,
      Math.round(bytesToRead),
      nrOfLines
    );
  },
  100
);

const toggleTailSwitchToOffOnScrollWhenFileIsRunning = (
  tailSwitch,
  logFileIsRunning,
  dispatch,
  sourcePath
) => {
  if (tailSwitch && logFileIsRunning) {
    handleTailSwitch(dispatch, { sourcePath });
  }
};

const LogViewer = props => {
  const filterInput = props.settings[props.source.path]
    ? props.settings[props.source.path].filterInput
    : '';
  const highlightInput = props.settings[props.source.path]
    ? props.settings[props.source.path].highlightInput
    : '';
  const highlightColor = props.tabSettings[props.source.path]
    ? props.tabSettings[props.source.path].highlightColor
    : 'red';
  const wrapLineOn = props.tabSettings[props.source.path]
    ? props.tabSettings[props.source.path].wrapLineOn
    : 'false';
  const tailSwitch = props.settings[props.source.path]
    ? props.settings[props.source.path].tailSwitch
    : 'false';
  const logSize = props.logSizes[props.source.path]
    ? props.logSizes[props.source.path]
    : 0;
  const lastSeenLogSize = props.lastSeenLogSizes[props.source.path]
    ? props.lastSeenLogSizes[props.source.path]
    : 0;
  const scrollPositionFromReducer = props.scrollPositions[props.source.path]
    ? props.scrollPositions[props.source.path]
    : 0;
  let meanByteValueOfCurrentLines = props.meanByteValuesOfLines[
    props.source.path
  ]
    ? props.meanByteValuesOfLines[props.source.path]
    : 100;

  // Calculating nrOfLinesInViewer * meanByteValues for a line in the file,
  // in order to make the base value of the scroll responsive to the size of the viewer
  // and the current file line lenghts.
  const AMOUNT_OF_LINES_FROM_BOTTOM = 5;
  const minScrollPositionValue = props.meanByteValuesOfInitialLines[
    props.source.path
  ]
    ? props.nrOfLinesInViewer *
        props.meanByteValuesOfInitialLines[props.source.path] -
      props.meanByteValuesOfInitialLines[props.source.path] *
        AMOUNT_OF_LINES_FROM_BOTTOM
    : 0;

  // Scroll position base is minScrollValue, top is logSize.
  const [filteredAndHighlightedLines, setLines] = useState([]);
  const [currentTimeout, setCurrentTimeout] = useState();
  const [currentLogViewerContainerHeight, setCurrentContainerHeight] = useState(
    0
  );
  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const logViewerContainerRef = useRef();

  let logFileHasRunningStatus =
    logSize > 0 && lastSeenLogSize > 0 && logSize > lastSeenLogSize;

  const sendMessageToHiddenWindow = args => {
    /* Send a message to the hidden window that it should filter the logs.
    IPC messages go through the main process and are stringified,
    but JSON can't serialize RegExes, so toString is used before that.
    For more information see mainScriptOffloader.js */
    let filterRegex = parseRegExp(filterInput),
      highlightRegex = parseRegExp(highlightInput);
    window.ipcRenderer.send('hiddenWindowMessages', {
      type: 'requestHelpFilterAndHighlightLines',
      filterRegexString: filterRegex ? filterRegex.toString() : '',
      highlightRegexString: highlightRegex ? highlightRegex.toString() : '',
      path: props.source.path,
      ...args
    });
  };

  const eventListenerIPCMessage = (event, args) => {
    // Assume there is only one LogViewer sending messages. props is stale here, so it can't reliably be used to see if the lines are for this source
    if (args.type === 'serveFilteredLogsOneDone') {
      // Update state using updater form, as the state in this function is stale
      setLines(lines => {
        return lines.concat(args.line);
      });
    } else if (args.type === 'serveFilteredLogsAllDone') {
      // Overwrite anything in the state
      setLines(args.lines);
    }
  };

  useEffect(() => {
    // Register the eventlistener for a message from the hidden window
    window.ipcRenderer.on('hiddenWindowMessages', eventListenerIPCMessage);
    // Return cleanup function for React to run when suited
    return () => {
      window.ipcRenderer.removeListener(
        'hiddenWindowMessages',
        eventListenerIPCMessage
      );
    };
  }, []);

  useEffect(() => {
    const logViewerContainerResizeHandler = _.debounce(() => {
      setCurrentContainerHeight(logViewerContainerRef.current.clientHeight);
    }, 50);
    logViewerContainerResizeHandler();
    window.addEventListener('resize', logViewerContainerResizeHandler);

    return () => {
      window.removeEventListener('resize', logViewerContainerResizeHandler);
    };
  }, []);

  useEffect(() => {
    /* Effect for when a new filter or highlight is applied,
    send the lines to be filtered and highlighted again */
    if (props.logs[props.source.path]) {
      // Reset the previous lines count, as all lines should be wiped.
      previousLinesLength.current = 0;
      sendMessageToHiddenWindow({
        logs: props.logs[props.source.path]
      });
    }
  }, [filterInput, highlightInput, highlightColor]);

  useEffect(() => {
    // Effect for when new lines are added
    if (props.logs[props.source.path]) {
      /* Only send lines one by one if there already are lines set.
      Slice used so only newer lines is sent or the entire array if no lines */
      let newLines = props.logs[props.source.path].slice(
        previousLinesLength.current
      );
      sendMessageToHiddenWindow({
        sendLinesOneByOne: previousLinesLength.current > 0 ? true : false,
        logs: newLines
      });
      previousLinesLength.current = props.logs.length;

      // Checking if the follow switch is on and if the log file is running, then keep the scrollbar at the base to follow.
      if (tailSwitch && logFileHasRunningStatus) {
        updateScrollPosition(
          props.dispatch,
          props.source.path,
          minScrollPositionValue
        );
      }
    }
  }, [props.logs]);

  useEffect(() => {
    // Effect for checking if tailswitch is on. If it is, and the file is running - lock the sliderPosition to the base and display the tail of the file.
    const EMPTY_LINES_BELOW_LAST_LINE = 3;
    const BYTE_AMOUNT_TO_FETCH =
      (props.nrOfLinesInViewer - EMPTY_LINES_BELOW_LAST_LINE) *
      meanByteValueOfCurrentLines;
    if (logFileHasRunningStatus && tailSwitch) {
      updateScrollPosition(
        props.dispatch,
        props.source.path,
        minScrollPositionValue
      );
      debouncedFetchTextByBytePosition(
        props.source.path,
        logSize - BYTE_AMOUNT_TO_FETCH,
        props.nrOfLinesInViewer
      );
    }
  }, [tailSwitch, logFileHasRunningStatus]);

  useEffect(() => {
    /* Effect for when another source is selected,
    to send the correct lines to be filtered and highlighted and update the ref to be the correct source */
    sendMessageToHiddenWindow({
      logs: props.logs[props.source.path]
    });
  }, [props.source.path]);

  useEffect(() => {
    const wheelScrollEventHandler = event => {
      const isVerticalScrollEvent = event.deltaY !== -0;
      if (isVerticalScrollEvent) {
        let amountOfPositionsToScroll =
          event.deltaY > 0
            ? -meanByteValueOfCurrentLines
            : meanByteValueOfCurrentLines;

        if (logViewerContainerRef.current) {
          let newScrollPosition =
            scrollPositionFromReducer + amountOfPositionsToScroll;
          if (newScrollPosition > logSize) {
            newScrollPosition = logSize;
          } else if (newScrollPosition <= minScrollPositionValue) {
            newScrollPosition = minScrollPositionValue;
          }

          toggleTailSwitchToOffOnScrollWhenFileIsRunning(
            tailSwitch,
            logFileHasRunningStatus,
            props.dispatch,
            props.source.path
          );

          //update scroll position when file is running ...
          updateScrollPosition(
            props.dispatch,
            props.source.path,
            newScrollPosition
          );
          console.log({ scrollPositionFromReducer });
        }
      }
    };

    logViewerContainerRef.current.addEventListener(
      'wheel',
      wheelScrollEventHandler
    );

    return () => {
      logViewerContainerRef.current.removeEventListener(
        'wheel',
        wheelScrollEventHandler
      );
    };
  }, [scrollPositionFromReducer, logSize]);

  useEffect(() => {
    const readBytesHandler = () => {
      // Clear timeout so we don't read from files too often
      clearTimeout(currentTimeout);
      // Set new timeout to read from file in an appropriate amount of time
      let timeout = setTimeout(() => {
        // Scroll base value is minScrollPositionValue,
        //we need to calculate logsize - scrollPosition to invert the values and get the text in the right order.
        fetchTextBasedOnByteFromScrollPosition(
          props.source.path,
          Math.round(logSize - scrollPositionFromReducer),
          props.nrOfLinesInViewer
        );
        // Save timeout so it can be cleared if needed
      }, 50);
      setCurrentTimeout(timeout);
    };

    logViewerContainerRef.current.addEventListener('wheel', readBytesHandler);

    return () => {
      logViewerContainerRef.current.removeEventListener(
        'wheel',
        readBytesHandler
      );
    };
  }, [
    scrollPositionFromReducer,
    currentTimeout,
    currentLogViewerContainerHeight,
    props.nrOfLinesInViewer
  ]);

  const handleCustomScrollBarOnChange = value => {
    toggleTailSwitchToOffOnScrollWhenFileIsRunning(
      tailSwitch,
      logFileHasRunningStatus,
      props.dispatch,
      props.source.path
    );
    //update scroll position in each scroll down or up for specific log
    updateScrollPosition(props.dispatch, props.source.path, value);
    debouncedFetchTextByBytePosition(
      props.source.path,
      logSize - value,
      props.nrOfLinesInViewer
    );
  };

  return (
    <LogViewerRootContainer>
      <LogViewerContainer ref={logViewerContainerRef}>
        <LogViewerList
          key={props.source.index}
          dispatcher={props.dispatch}
          highlightColor={highlightColor}
          wrapLines={wrapLineOn}
          lines={filteredAndHighlightedLines}
          sourcePath={props.source.path}
          logSize={logSize}
          containerHeight={currentLogViewerContainerHeight}
        />
      </LogViewerContainer>
      <CustomScrollBar
        handleOnChange={handleCustomScrollBarOnChange}
        max={logSize}
        min={minScrollPositionValue}
        value={scrollPositionFromReducer}
        step={1}
      />
    </LogViewerRootContainer>
  );
};

const mapStateToProps = ({
  topPanelState: { settings },
  settingsState: { tabSettings },
  logViewerState: {
    logs,
    nrOfLinesInViewer,
    startByteOfLines,
    meanByteValuesOfInitialLines,
    meanByteValuesOfLines,
    scrollPositions
  },
  logInfoState: { logSizes, lastSeenLogSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes,
    lastSeenLogSizes,
    nrOfLinesInViewer,
    startByteOfLines,
    meanByteValuesOfInitialLines,
    meanByteValuesOfLines,
    scrollPositions
  };
};

export default connect(mapStateToProps)(LogViewer);
