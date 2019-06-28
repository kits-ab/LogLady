import React from 'react';
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
        highlightRegExp={parseRegExp(props.highlightInput)}
        filterRegExp={parseRegExp(props.filterInput)}
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
