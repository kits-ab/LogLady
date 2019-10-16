/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  LogViewerContainer,
  CloseFileButton
} from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import { parseRegExp } from './helpers/regexHelper';

const LogViewer = props => {
  const [filteredAndHighlightedLines, setLines] = useState([]);

  const sendMessageToHiddenWindow = args => {
    // Send a message to the hidden window that it should filter the logs. IPC messages go through the main process and are stringified - but JSON can't serialize RegExes, so I use toString before that
    let filterRegex = parseRegExp(props.filterInput),
      highlightRegex = parseRegExp(props.highlightInput);
    window.ipcRenderer.send('hiddenWindowMessages', {
      type: 'requestHelpFilterAndHighlightLines',
      filterRegexString: filterRegex ? filterRegex.toString() : '',
      highlightRegexString: highlightRegex ? highlightRegex.toString() : '',
      path: props.source.path,
      ...args
    });
  };

  const eventListenerIPCMessage = (event, args) => {
    if (args.path === props.source.path) {
      if (args.type === 'serveFilteredLogsOneDone') {
        // Update state using updater form, as the state in this function is stale
        setLines(lines => {
          return lines.concat(args.line);
        });
      } else if (args.type === 'serveFilteredLogsAllDone') {
        // Overwrite anything in the state
        setLines(args.lines);
      }
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
    if (props.logs[props.source.path]) {
      sendMessageToHiddenWindow({
        logs: props.logs[props.source.path]
      });
    }
  }, [props.filterInput, props.highlightInput]);

  useEffect(() => {
    if (props.logs[props.source.path]) {
      // Only send lines one by one if there already are lines set. Slice used so only newer lines is sent or the entire array if no lines
      sendMessageToHiddenWindow({
        sendLinesOneByOne:
          filteredAndHighlightedLines.length > 0 ? true : false,
        logs: props.logs[props.source.path].slice(
          filteredAndHighlightedLines.length
        )
      });
    }
  }, [props.logs]);

  return (
    <LogViewerContainer>
      <CloseFileButton
        show={props.source}
        onClick={() => {
          closeFile(props.dispatch, props.source.path);
        }}
      />
      <LogViewerList
        key={props.source.index}
        highlightColor={props.highlightColor}
        wrapLines={props.wrapLineOn}
        scrollToBottom={props.tailSwitch}
        lines={filteredAndHighlightedLines}
      />
    </LogViewerContainer>
  );
};

const mapStateToProps = ({
  topPanelState: { filterInput, highlightInput, tailSwitch },
  settingsState: { highlightColor, wrapLineOn },
  logViewerState: { logs }
}) => {
  return {
    filterInput,
    highlightInput,
    tailSwitch,
    highlightColor,
    wrapLineOn,
    logs
  };
};

export default connect(mapStateToProps)(LogViewer);
