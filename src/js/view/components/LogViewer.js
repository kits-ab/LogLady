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
import WindowedList from 'react-list';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.windowedList = React.createRef();
  }

  createLineArray = (lines, filter) => {
    const lineArray = [];
    lineArray.push(...lines.split('\n'));
    const matchArray = findMatches(filter, lineArray);

    return matchArray;
  };

  hasMatch = (line, regex) => {
    return regex && line.match(new RegExp(regex, 'i'));
  };

  scrollToBottom = () => {
    this.windowedList.current.scrollAround(this.props.liveLines.length);
  };

  componentDidUpdate() {
    if (this.props.tailSwitch) this.scrollToBottom();
  }

  itemRenderer = lines => {
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
    let lines =
      this.props.liveLines &&
      this.createLineArray(this.props.liveLines, this.props.filterInput);

    return (
      <LogViewContainer>
        <CloseFileButton
          openFiles={this.props.openFiles}
          onClick={() => {
            closeFile(
              this.props.dispatch,
              this.props.openFiles ? this.props.openFiles : ''
            );
          }}
        />
        <Log>
          <WindowedList
            itemRenderer={this.itemRenderer(lines)}
            length={lines.length}
            type="uniform"
            ref={this.windowedList}
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
