/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { LogViewerContainer } from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { parseRegExp } from './helpers/regexHelper';
import { Slider } from 'office-ui-fabric-react';
import { fetchTextBasedOnByteFromScrollPosition } from './helpers/logHelper';

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

  const [filteredAndHighlightedLines, setLines] = useState([]); // Used to save and update the current filtered and highlighted lines
  const [sliderPosition, setSliderPosition] = useState(0);
  const [currentTimeout, setCurrentTimeout] = useState();
  let previousLinesLength = useRef(0); // Used to keep track of how many lines there were last time useEffect was called, for optimizing and only sending the new lines
  const logViewerContainerRef = useRef();

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
    const wheelHandler = event => {
      if (logViewerContainerRef.current) {
        let newSliderPosition = sliderPosition + event.deltaY;
        if (newSliderPosition > logSize) {
          newSliderPosition = logSize;
        } else if (newSliderPosition <= 0) {
          newSliderPosition = 0;
        }

        setSliderPosition(newSliderPosition);
      }
    };

    logViewerContainerRef.current.addEventListener('wheel', wheelHandler);

    return () => {
      logViewerContainerRef.current.removeEventListener('wheel', wheelHandler);
    };
  }, [sliderPosition, logSize]);

  useEffect(() => {
    const readBytesHandler = () => {
      console.log('Byteposition: ', logSize - sliderPosition);

      // CLear timeout so we don't read from files too often
      clearTimeout(currentTimeout);
      // Set new timeout to read from file in an appropriate amount of time
      let timeout = setTimeout(() => {
        fetchTextBasedOnByteFromScrollPosition(
          props.source.path,
          // Since slider starts at 0 we need to alter the value like this to get the correct byte position.
          logSize - sliderPosition,
          25
        );
      }, 50);
      // Save timeout so it can be cleared if needed
      setCurrentTimeout(timeout);
    };

    logViewerContainerRef.current.addEventListener('wheel', readBytesHandler);

    return () => {
      logViewerContainerRef.current.removeEventListener(
        'wheel',
        readBytesHandler
      );
    };
  }, [sliderPosition, currentTimeout]);

  const styles = {
    // activeSection: { /*height: ?*/ color: 'lightgray' },
    // container: {},
    // inactiveSection: { background: 'lightgray' },
    // line: { color: 'lightgray' },
    // lineContainer: { width: '28px', background: 'lightgray' },
    // root: { background: 'lightgray' },
    // slideBox: {
    //   color: 'lightgray',
    //   width: '28px'
    // },
    // thumb: {
    //   background: 'gray',
    //   borderRadius: 'none',
    //   width: '20px',
    //   border: 'none',
    //   margin: 'auto'
    //   // height ? depending on filesize?
    // },
    // titleLabel: {},
    // valueLabel: {},
    // zeroTick: {}
  };

  return (
    <LogViewerContainer ref={logViewerContainerRef}>
      <LogViewerList
        key={props.source.index}
        highlightColor={highlightColor}
        wrapLines={wrapLineOn}
        scrollToBottom={tailSwitch}
        lines={filteredAndHighlightedLines}
        sourcePath={props.source.path}
        logSize={logSize}
      />
      <Slider
        min={0}
        max={logSize}
        step={1}
        vertical
        showValue={false}
        value={sliderPosition}
        onChange={value => {
          setSliderPosition(value);
          fetchTextBasedOnByteFromScrollPosition(
            props.source.path,
            logSize - value,
            25
          );
        }}
        styles={styles}
      ></Slider>
    </LogViewerContainer>
  );
};

const mapStateToProps = ({
  topPanelState: { settings },
  settingsState: { tabSettings },
  logViewerState: { logs },
  logInfoState: { logSizes }
}) => {
  return {
    settings,
    tabSettings,
    logs,
    logSizes
  };
};

export default connect(mapStateToProps)(LogViewer);
