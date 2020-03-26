/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { LogViewerContainer } from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
import { calculatePositionInFile } from './helpers/cacheHelper';
import { setInitialCache, setTailSwitch } from '../actions/dispatchActions';

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
  const lengthOfFetch = props.lengthOfInitialLineArrays[props.source.path]
    ? props.lengthOfInitialLineArrays[props.source.path]
    : 0;

  const [filteredAndHighlightedLines, setLines] = useState([]);

  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const scroller = useRef(); // A ref on the logViewerContainer used to keep track of scroll values.

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
    }
  }, [props.logs]);

  useEffect(() => {
    /* Effect for when another source is selected,
    to send the correct lines to be filtered and highlighted and update the ref to be the correct source */

    sendMessageToHiddenWindow({
      logs: props.logs[props.source.path]
    });
  }, [props.source.path]);

  useEffect(() => {
    // Effect for adding the correct amount of empty lines above the initial log lines.
    const nrOfLinesInFile = props.nrOfLinesOfOpenFiles[props.source.path];
    if (props.logs[props.source.path]) {
      const lengthOfListitems = props.logs[props.source.path].length;
      if (nrOfLinesInFile > 0 && lengthOfListitems !== nrOfLinesInFile) {
        const emptyLines = new Array(nrOfLinesInFile - lengthOfListitems).fill(
          '.',
          0
        );
        setInitialCache(props.dispatch, props.source.path, emptyLines);
        // scroll to bottom
        scroller.current.scrollTo(0, scroller.current.scrollHeight);
      }
    }
  }, [props.nrOfLinesOfOpenFiles[props.source.path]]);

  // TODO: Use this to fetch new text from engine in a smart way.
  useEffect(() => {
    // Effect for handling calculation of the current position in the file based on the scroll position value (percentage from top).
    // Might need another dependency than the logSize value later on.
    if (logSize > 0) {
      const handleScrollPositionEvent = () => {
        calculatePositionInFile(
          scroller.current.scrollTop,
          scroller.current.clientHeight,
          scroller.current.scrollHeight,
          logSize
        );
      };
      scroller.current.addEventListener('scroll', handleScrollPositionEvent);

      return () => {
        scroller.current.removeEventListener(
          'scroll',
          handleScrollPositionEvent
        );
      };
    }
  }, [logSize]);

  useEffect(() => {
    //Effect to set tailswitch to true when scrolling or clicking at the bottom
    const handleScrollEvent = () => {
      const isScrollerAtTheBottom =
        scroller.current.scrollHeight ===
        scroller.current.clientHeight + scroller.current.scrollTop;

      if (isScrollerAtTheBottom) {
        setTailSwitch(props.dispatch, {
          sourcePath: props.source.path,
          isScrollerAtTheBottom // true
        });
      } else {
        if (tailSwitch) {
          setTailSwitch(props.dispatch, {
            sourcePath: props.source.path,
            isScrollerAtTheBottom // false
          });
        }
      }
    };

    scroller.current.addEventListener('scroll', handleScrollEvent);

    return () => {
      scroller.current.removeEventListener('scroll', handleScrollEvent);
    };
  }, [props.source.path]);

  useEffect(() => {
    //Effect for scrolling opened file to bottom
    scroller.current.scrollTo(0, scroller.current.scrollHeight);
  }, [props.source.path]);

  useEffect(() => {
    //Effect for scrolling to bottom when switching on tailswitch
    if (tailSwitch) {
      scroller.current.scrollTo(0, scroller.current.scrollHeight);
    }
  }, [filteredAndHighlightedLines, tailSwitch]);

  return (
    <LogViewerContainer ref={scroller}>
      <LogViewerList
        key={props.source.index}
        dispatcher={props.dispatch}
        highlightColor={highlightColor}
        wrapLines={wrapLineOn}
        lines={filteredAndHighlightedLines}
        sourcePath={props.source.path}
        logSize={logSize}
      />
    </LogViewerContainer>
  );
};

const mapStateToProps = ({
  topPanelState: { settings },
  settingsState: { tabSettings },
  logViewerState: {
    logs,
    startByteOfLines,
    nrOfLinesOfOpenFiles,
    lengthOfInitialLineArrays
  },
  logInfoState: { logSizes, lastSeenLogSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes,
    lastSeenLogSizes,
    startByteOfLines,
    nrOfLinesOfOpenFiles,
    lengthOfInitialLineArrays
  };
};

export default connect(mapStateToProps)(LogViewer);
