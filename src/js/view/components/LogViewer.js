import React from 'react';
import {
  LogViewerContainer,
  CloseFileButton
} from '../styledComponents/LogViewerStyledComponents';
import LogViewerList from './LogViewerList';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import { parseRegExp } from 'js/view/components/helpers/regexHelper.js';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      escapeRegexSequence: '@'
    };
  }

  render() {
    const highlightRegExp = parseRegExp(
      this.props.highlightInput,
      this.state.escapeRegexSequence
    );
    const filterRegExp = parseRegExp(
      this.props.filterInput,
      this.state.escapeRegexSequence
    );

    return (
      <LogViewerContainer>
        <CloseFileButton
          openFiles={this.props.openFiles}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.openFiles ? this.props.openFiles : ''
            );
          }}
        />
        <LogViewerList
          highlightColor={this.props.highlightColor}
          wrapLines={this.props.wrapLineOn}
          scrollToBottom={this.props.tailSwitch}
          lines={this.props.liveLines}
          highlightRegExp={highlightRegExp}
          filterRegExp={filterRegExp}
        />
      </LogViewerContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterInput: state.topPanelReducer.filterInput,
    highlightInput: state.topPanelReducer.highlightInput,
    highlightColor: state.settingsReducer.highlightColor,
    wrapLineOn: state.settingsReducer.wrapLineOn,
    liveLines: state.logViewerReducer.liveLines,
    nthLines: state.logViewerReducer.nthLines,
    tailSwitch: state.topPanelReducer.tailSwitch,
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(LogViewer);
