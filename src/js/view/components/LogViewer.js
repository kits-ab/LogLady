/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { LogViewerContainer } from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
import { saveCurrentScrollTop } from '../actions/dispatchActions';
import {
  fetchNewLinesFromBackendCache,
  updateLogViewerCache
} from './helpers/logHelper';

const LogViewer = props => {
  const filterInput = props.settings[props.source.path]
    ? props.settings[props.source.path].filterInput
    : '';
  const highlightInput = props.settings[props.source.path]
    ? props.settings[props.source.path].highlightInput
    : '';
  const highlightColor = props.tabSettings[props.source.path]
    ? props.tabSettings[props.source.path].highlightColor
    : '#a4262c';
  const wrapLineOn = props.tabSettings[props.source.path]
    ? props.tabSettings[props.source.path].wrapLineOn
    : 'false';
  const tailSwitch = props.settings[props.source.path]
    ? props.settings[props.source.path].tailSwitch
    : 'false';
  const logLinesLength = props.lengthOfInitialLogLineArrays[props.source.path]
    ? props.lengthOfInitialLogLineArrays[props.source.path]
    : 0;
  const totalNrOfLinesInFile = props.totalNrOfLinesForFiles[props.source.path]
    ? props.totalNrOfLinesForFiles[props.source.path]
    : false;
  const emptyLinesLength = props.lengthOfEmptyLines[props.source.path]
    ? props.lengthOfEmptyLines[props.source.path]
    : 0;

  const [filteredAndHighlightedLines, setLines] = useState([]);
  const [currentScrollTop, setCurrentScrollTop] = useState(0);

  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const scroller = useRef(); // A ref on the logViewerContainer used to keep track of scroll values.

  const _getMoreLogLines = indexForNewLines => {
    fetchNewLinesFromBackendCache(
      props.source.path,
      logLinesLength,
      indexForNewLines,
      totalNrOfLinesInFile
    );
  };

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
        if (tailSwitch) {
          return lines.concat(args.line);
        }
      });
    } else if (args.type === 'serveFilteredLogsAllDone') {
      overWriteState(args.lines);
    }
  };

  const overWriteState = newLogLines => {
    const wholeFileIsNotInFeCache = emptyLinesLength > 0;
    if (
      props.totalNrOfLinesForFiles[props.source.path] &&
      wholeFileIsNotInFeCache
    ) {
      const cacheLength = props.totalNrOfLinesForFiles[props.source.path];
      const startIndex = props.indexesForNewLines[props.source.path];

      const newCache = updateLogViewerCache(cacheLength).insertRows(
        startIndex,
        newLogLines
      );
      setLines(newCache);
    } else {
      setLines(newLogLines);
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
  }, [
    props.totalNrOfLinesForFiles[props.source.path],
    props.indexesForNewLines[props.source.path]
  ]);

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
    const handleScrollPositionEvent = event => {
      setCurrentScrollTop(event.target.scrollTop);
    };
    scroller.current.addEventListener('scroll', event => {
      return handleScrollPositionEvent(event);
    });
    return () => {
      scroller.current.removeEventListener('scroll', handleScrollPositionEvent);
    };
  }, [totalNrOfLinesInFile]);

  useEffect(() => {
    if (tailSwitch && emptyLinesLength > 0) {
      _getMoreLogLines(totalNrOfLinesInFile - logLinesLength);
    }
  }, [tailSwitch]);

  useEffect(() => {
    if (tailSwitch) {
      scroller.current.scrollTo(0, scroller.current.scrollHeight);
    }
  }, [tailSwitch, filteredAndHighlightedLines]);

  useEffect(() => {
    saveCurrentScrollTop(props.dispatch, props.source.path, currentScrollTop);
  }, [currentScrollTop]);

  useEffect(() => {
    scroller.current.scrollTo(0, props.currentScrollTops[props.source.path]);
  }, [props.source.path]);

  return (
    <LogViewerContainer ref={scroller} data-is-scrollable="true">
      <LogViewerList
        highlightColor={highlightColor}
        wrapLines={wrapLineOn}
        lines={filteredAndHighlightedLines}
        scrollTop={currentScrollTop}
        getMoreLogLines={_getMoreLogLines}
        logLinesLength={logLinesLength}
        wholeFileNotInFeCache={emptyLinesLength > 0}
      />
    </LogViewerContainer>
  );
};

const mapStateToProps = ({
  topPanelState: { settings },
  settingsState: { tabSettings },
  logViewerState: {
    logs,
    lengthOfInitialLogLineArrays,
    totalNrOfLinesForFiles,
    lengthOfEmptyLines,
    currentScrollTops,
    indexesForNewLines
  },
  logInfoState: { logSizes, lastSeenLogSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes,
    lastSeenLogSizes,
    lengthOfInitialLogLineArrays,
    totalNrOfLinesForFiles,
    lengthOfEmptyLines,
    currentScrollTops,
    indexesForNewLines
  };
};

export default connect(mapStateToProps)(LogViewer);
