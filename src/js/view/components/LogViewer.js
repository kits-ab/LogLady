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

  hardcodedTheme = () => {
    return {
      line: {
        background: '#0f31bc',
        color: 'white'
      },
      match: {
        background: 'yellow',
        color: 'black',
        fontWeight: 'bold'
      }
    };
  };

  hasMatch = (line, match) => {
    return match && line.match(new RegExp(match, 'i'));
  };

  highlightMatches = (line, theme) => {
    const group = '(' + this.props.highlightInput + ')'; //Parenthesis required for reactStringReplace to work properly
    const regex = new RegExp(group, 'gi');
    return reactStringReplace(line, regex, (match, i) => {
      return (
        <span key={i} style={theme.match}>
          {match}
        </span>
      );
    });
  };

  highlightLine = (line, theme) => {
    return <span style={theme.line}>{this.highlightMatches(line, theme)}</span>;
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
                {this.hasMatch(line, this.props.highlightInput)
                  ? this.highlightLine(line, this.hardcodedTheme())
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
