/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { LogViewerContainer } from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
// import { initializeCache } from './helpers/cacheHelper';
import { setInitialCache } from '../actions/dispatchActions';

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
  // const startByteOfLines = props.startByteOfLines[props.source.path]
  //   ? props.startByteOfLines[props.source.path]
  //   : [];

  const [filteredAndHighlightedLines, setLines] = useState([]);

  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const logViewerContainerRef = useRef();
  const viewerListRef = useRef(null);

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

  // TODO: 1: when total amount of lines are calculated, itialize cache and add invisible lines to top of list, (dispatch to redux?) the scrollbar should scale to proper size. (small?)

  // TODO: 2: Make the scrollbar scroll to bottom when first opening a file, and when following a file. (small?)

  // TODO: 3: Depending on nr 1. Send a request for more lines if it is getting close to the start or the end of the list lines that contains the log text.
  //          Add those rows to frontend cache in redux. (large?)

  // TODO: 4: Depending on nr 3. Make the filtering feature work. Some kind of auto refill of the lines while scrolling? (large?)

  useEffect(() => {
    // Effect for adding the correct amount of empty lines above the initial log lines. Should make the scrollbar scale to the right height for the file size.
    const nrOfLinesInFile = props.nrOfLinesOfOpenFiles[props.source.path];
    if (props.logs[props.source.path]) {
      const lengthOfListitems = props.logs[props.source.path].length;
      if (nrOfLinesInFile > 0 && lengthOfListitems !== nrOfLinesInFile) {
        const emptyLines = new Array(nrOfLinesInFile - lengthOfListitems).fill(
          '.',
          0
        );

        console.log(emptyLines.length, { lengthOfListitems, nrOfLinesInFile });
        setInitialCache(props.dispatch, props.source.path, emptyLines);
      }
    }
  }, [props.nrOfLinesOfOpenFiles[props.source.path]]);

  return (
    <LogViewerContainer ref={logViewerContainerRef}>
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
  logViewerState: { logs, startByteOfLines, nrOfLinesOfOpenFiles },
  logInfoState: { logSizes, lastSeenLogSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes,
    lastSeenLogSizes,
    startByteOfLines,
    nrOfLinesOfOpenFiles
  };
};

export default connect(mapStateToProps)(LogViewer);
