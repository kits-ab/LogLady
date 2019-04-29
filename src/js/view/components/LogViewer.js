import React from 'react';
import { findMatches } from './helpers/lineFilterHelper';
import * as LogViewerSC from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import reactStringReplace from 'react-string-replace';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.liveLinesContainer = React.createRef();
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.liveLines.split('\n'));
    const matchArray = findMatches(this.props.filterInput, lineArray);

    return matchArray;
  };

  componentDidMount = () => {
    const containerObserver = new MutationObserver(this.scrollToBottom);
    const observerConfig = { childList: true };
    containerObserver.observe(this.liveLinesContainer.current, observerConfig);
  };

  scrollToBottom = () => {
    if (this.props.tailSwitch) {
      this.liveLinesContainer.current.scrollTo(
        0,
        this.liveLinesContainer.current.scrollHeight
      );
    }
  };

  lineHighlightStyle = () => {
    return {
      background: '#0f31bc',
      color: 'white'
    };
  };

  matchHighlightStyle = () => {
    return {
      background: 'yellow',
      color: 'black',
      fontWeight: 'bold'
    };
  };

  hasMatch = line => {
    const regex = new RegExp(this.props.highlightInput, 'i');
    return line.match(regex);
  };

  highlightMatches = line => {
    const regex = new RegExp('(' + this.props.highlightInput + ')', 'gi'); //Regexp needs to be in a regexp group for reactStringReplace to work
    return reactStringReplace(line, regex, (match, i) => {
      return (
        <span key={i} style={this.matchHighlightStyle()}>
          {match}
        </span>
      );
    });
  };

  highlightLine = line => {
    return (
      <span style={this.lineHighlightStyle()}>
        {this.highlightMatches(line)}
      </span>
    );
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
    return (
      <LogViewerSC.TextContainer ref={this.liveLinesContainer}>
        <LogViewerSC.CloseFileButton
          openFiles={this.props.openFiles}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.openFiles ? this.props.openFiles : ''
            );
          }}
        />
        {lines &&
          lines.map((line, i) => {
            return (
              <p key={i}>
                {this.hasMatch(line) && this.props.highlightInput
                  ? this.highlightLine(line)
                  : line}
              </p>
            );
          })}
      </LogViewerSC.TextContainer>
    );
  }
}

const mapStateToProps = state => {
  return {
    filterInput: state.topPanelReducer.filterInput,
    highlightInput: state.topPanelReducer.highlightInput,
    highlightColor: state.settingsReducer.highlightColor,
    liveLines: state.logViewerReducer.liveLines,
    nthLines: state.logViewerReducer.nthLines,
    tailSwitch: state.topPanelReducer.tailSwitch,
    openFiles: state.menuReducer.openFiles
  };
};

export default connect(mapStateToProps)(LogViewer);
