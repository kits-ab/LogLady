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

    this.windowedList = React.createRef();
  }

  render() {
    const lines = this.props.logs[this.props.source];

    const highlightRegExp = parseRegExp(this.props.highlightInput);
    const filterRegExp = parseRegExp(this.props.filterInput);

    return (
      <LogViewerContainer>
        <CloseFileButton
          show={this.props.source}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.source ? this.props.source : ''
            );
          }}
        />
        <LogViewerList
          key={this.props.source}
          highlightColor={this.props.highlightColor}
          wrapLines={this.props.wrapLineOn}
          scrollToBottom={this.props.tailSwitch}
          lines={lines ? lines : []}
          highlightRegExp={highlightRegExp}
          filterRegExp={filterRegExp}
        />
      </LogViewerContainer>
    );
  }
}

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
