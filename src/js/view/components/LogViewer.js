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
    this.state = {
      escapeRegexPrefix: '学生'
    };
  }

  applyFilter = (lines, filter) => {
    return !filter ? lines : findMatches(filter, lines);
  };

  hasMatch = (line, regex) => {
    return regex.test(line);
  };

  scrollToBottom = (el, list) => {
    el.scrollAround(list.length);
  };

  componentDidUpdate() {
    if (this.props.tailSwitch)
      this.scrollToBottom(this.windowedList.current, this.props.liveLines);
  }

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

  itemRenderer = (lines, regex) => {
    return (i, key) => {
      return (
        <LogLine
          key={key}
          index={i}
          wrap={this.props.wrapLineOn ? 'true' : undefined}
        >
          {regex && this.hasMatch(lines[i], regex) ? (
            <TextHighlightRegex
              text={lines[i]}
              color={this.props.highlightColor}
              regex={regex}
            />
          ) : (
            lines[i]
          )}
        </LogLine>
      );
    };
  };

  render() {
    const lines =
      this.props.liveLines &&
      this.applyFilter(this.props.liveLines, this.props.filterInput);

    const regexInput = this.parseRegexInput(
      this.props.highlightInput,
      this.state.escapeRegexPrefix
    );

    const regex = !regexInput
      ? undefined
      : new RegExp('(' + regexInput + ')', 'i');

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
            itemRenderer={this.itemRenderer(lines, regex)}
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
