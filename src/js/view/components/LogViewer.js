import React, { useState, useEffect } from 'react';
import {
  LogViewerContainer,
  CloseFileButton
} from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import { parseRegExp } from 'js/view/components/helpers/regexHelper.js';

const LogViewer = props => {
  const lines = props.logs[props.source.path];

  const [highlightRegExp, setHighlightRegExp] = useState(undefined);
  const [filterRegExp, setFilterRegExp] = useState(undefined);

  useEffect(() => {
    setHighlightRegExp(parseRegExp(props.highlightInput));
  }, [props.highlightInput]);

  useEffect(() => {
    setFilterRegExp(parseRegExp(props.filterInput));
  }, [props.filterInput]);

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
        lines={lines ? lines : []}
        highlightRegExp={highlightRegExp}
        filterRegExp={filterRegExp}
      />
    </LogViewerContainer>
  );
};

const mapStateToProps = ({
  topPanelReducer,
  settingsReducer,
  logViewerReducer
}) => {
  return {
    filterInput: topPanelReducer.filterInput,
    highlightInput: topPanelReducer.highlightInput,
    highlightColor: settingsReducer.highlightColor,
    wrapLineOn: settingsReducer.wrapLineOn,
    logs: logViewerReducer.logs,
    tailSwitch: topPanelReducer.tailSwitch
  };
};

export default connect(mapStateToProps)(LogViewer);
