import React from 'react';
import { findMatches } from './helpers/lineFilterHelper';
import {
  LogViewContainer,
  CloseFileButton,
  Log,
  LogLine
} from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import TextHighlightRegex from './TextHighlightRegex';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.liveLinesContainer = React.createRef();
    this.logLines = React.createRef();
    this.state = {
      scrollOffset: 0,
      escapeRegexPrefix: '学生'
    };
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
    containerObserver.observe(this.logLines.current, observerConfig);
  };

  scrollToBottom = () => {
    if (this.props.tailSwitch) {
      this.liveLinesContainer.current.scroll({
        top: this.liveLinesContainer.current.scrollHeight,
        left: 0
      });
    }
  };

  parseRegexInput = (input, escapeRegexPrefix) => {
    if (!input) return '';

    if (input.startsWith(escapeRegexPrefix))
      return input
        .slice(escapeRegexPrefix.length)
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    try {
      new RegExp(input);
      return input;
    } catch (e) {
      return '';
    }
  };

  hasMatch = (line, regex) => {
    return regex && line.match(new RegExp(regex, 'i'));
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
    const regexInput = this.parseRegexInput(
      this.props.highlightInput,
      this.state.escapeRegexPrefix
    );
    return (
      <LogViewContainer ref={this.liveLinesContainer}>
        <CloseFileButton
          openFiles={this.props.openFiles}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.openFiles ? this.props.openFiles : ''
            );
          }}
        />
        <Log ref={this.logLines}>
          {lines &&
            lines.map((line, i) => {
              return (
                <LogLine
                  key={i}
                  wrap={this.props.wrapLineOn ? 'true' : undefined}
                >
                  {this.hasMatch(line, regexInput) ? (
                    <TextHighlightRegex
                      text={line}
                      color={this.props.highlightColor}
                      regex={regexInput}
                    />
                  ) : (
                    line
                  )}
                </LogLine>
              );
            })}
        </Log>
      </LogViewContainer>
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
