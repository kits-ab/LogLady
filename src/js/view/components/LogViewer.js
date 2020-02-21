/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import {
  LogViewerParent,
  LogViewerContainer
} from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import CustomScrollBar from './CustomScrollBar';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
import { fetchTextBasedOnByteFromScrollPosition } from './helpers/logHelper';
import _ from 'lodash';

const debouncedFetchTextByBytePosition = _.debounce(
  (path, bytesToRead, nrOfLines) => {
    fetchTextBasedOnByteFromScrollPosition(path, bytesToRead, nrOfLines);
  },
  100
);

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
    : 'true';
  const logSize = props.logSizes[props.source.path]
    ? props.logSizes[props.source.path]
    : 0;
  const lastSeenLogSize = props.lastSeenLogSizes[props.source.path];

  const [filteredAndHighlightedLines, setLines] = useState([]);
  // Scroll position base is 0, top is logSize
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentTimeout, setCurrentTimeout] = useState();
  const [currentLogViewerContainerHeight, setCurrentContainerHeight] = useState(
    0
  );

  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const logViewerContainerRef = useRef();

  let logFileHasRunningStatus = logSize > lastSeenLogSize;

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
      setCurrentContainerHeight(logViewerContainerRef.current.offsetHeight);
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

      // Checking if the follow switch is on and if the log file is running.
      if (tailSwitch && logFileHasRunningStatus) {
        setScrollPosition(0);
      }
    }
  }, [props.logs]);

  useEffect(() => {
    // Effect for checking if tailswitch is on. If it is - lock the sliderPosition to 0 and display the tail of the file.
    const APPROXIMATE_AMOUNT_OF_BYTES_TO_FETCH = 10000;
    const LINES_FROM_VIEWCONTAINER_BOTTOM = 5;

    if (logFileHasRunningStatus && tailSwitch) {
      setScrollPosition(0);
      debouncedFetchTextByBytePosition(
        props.source.path,
        logSize - APPROXIMATE_AMOUNT_OF_BYTES_TO_FETCH,
        props.nrOfLinesInViewer - LINES_FROM_VIEWCONTAINER_BOTTOM
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
      if (logViewerContainerRef.current) {
        let newScrollPosition = scrollPosition + event.deltaY;
        if (newScrollPosition > logSize) {
          newScrollPosition = logSize;
        } else if (newScrollPosition <= 0) {
          newScrollPosition = 0;
        }

        setScrollPosition(newScrollPosition);
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
  }, [scrollPosition, logSize]);

  useEffect(() => {
    const readBytesHandler = () => {
      // Clear timeout so we don't read from files too often
      clearTimeout(currentTimeout);
      // Set new timeout to read from file in an appropriate amount of time
      if (tailSwitch && logFileHasRunningStatus) {
        setScrollPosition(0);
      } else {
        let timeout = setTimeout(() => {
          // Slider base is 0 so we need to calculate logsize - sliderPosition in order to get the correct byte position.
          fetchTextBasedOnByteFromScrollPosition(
            props.source.path,
            logSize - scrollPosition,
            props.nrOfLinesInViewer
          );
          // Save timeout so it can be cleared if needed
          setCurrentTimeout(timeout);
        }, 50);
      }
    };

    logViewerContainerRef.current.addEventListener('wheel', readBytesHandler);

    return () => {
      logViewerContainerRef.current.removeEventListener(
        'wheel',
        readBytesHandler
      );
    };
  }, [
    scrollPosition,
    currentTimeout,
    currentLogViewerContainerHeight,
    props.nroflines
  ]);

  const handleCustomScrollBarOnChange = value => {
    if (tailSwitch && logFileHasRunningStatus) {
      setScrollPosition(0);
    } else {
      setScrollPosition(value);
      debouncedFetchTextByBytePosition(
        props.source.path,
        logSize - value,
        props.nrOfLinesInViewer
      );
    }
  };

  return (
    <LogViewerParent>
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
        logSize={logSize}
        scrollPosition={scrollPosition}
        step={1}
      />
    </LogViewerParent>
  );
};

const mapStateToProps = ({
  topPanelState: { settings },
  settingsState: { tabSettings },
  logViewerState: { logs, nrOfLinesInViewer },
  logInfoState: { logSizes, lastSeenLogSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes,
    lastSeenLogSizes,
    nrOfLinesInViewer
  };
};

export default connect(mapStateToProps)(LogViewer);
