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
    this.state = {
      scrollOffset: 0
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

  hasMatch = (line, regex) => {
    return regex && line.match(new RegExp(regex, 'i'));
  };

  render() {
    const lines = this.props.liveLines && this.createLineArray();
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
        <Log ref="log">
          {lines &&
            lines.map((line, i) => {
              return (
                <LogLine
                  key={i}
                  wrap={this.props.wrapLineOn ? 'true' : undefined}
                >
                  {this.hasMatch(line, this.props.highlightInput) ? (
                    <TextHighlightRegex
                      text={line}
                      color={this.props.highlightColor}
                      regex={this.props.highlightInput}
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
