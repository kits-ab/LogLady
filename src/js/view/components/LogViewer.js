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
import WindowedList from 'react-windowed-list';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lines: []
    };
  }

  createLineArray = () => {
    const lineArray = [];
    lineArray.push(...this.props.liveLines.split('\n'));
    const matchArray = findMatches(this.props.filterInput, lineArray);

    return matchArray;
  };

  scrollToBottom = () => {
    this.outerList.scrollTo(0, this.outerList.scrollHeight);
  };

  componentDidUpdate() {
    if (this.props.tailSwitch) {
      this.scrollToBottom();
    }
  }

  hasMatch = (line, regex) => {
    return regex && line.match(new RegExp(regex, 'i'));
  };

  renderItem = lines => {
    return (i, key) => {
      return (
        <LogLine
          key={key}
          index={i}
          wrap={this.props.wrapLineOn ? 'true' : undefined}
        >
          {this.hasMatch(lines[i], this.props.highlightInput) ? (
            <TextHighlightRegex
              text={lines[i]}
              color={this.props.highlightColor}
              regex={this.props.highlightInput}
            />
          ) : (
            lines[i]
          )}
        </LogLine>
      );
    };
  };

  render() {
    this.lines = this.props.liveLines && this.createLineArray();
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
        <Log
          ref={el => {
            this.outerList = el;
          }}
        >
          <WindowedList
            itemRenderer={this.renderItem(this.lines)}
            pageSize={10}
            length={this.lines.length}
            ref={el => {
              this.list = el;
            }}
            type="variable"
          />
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
