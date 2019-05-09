import React from 'react';
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
import {
  createRegexOrUndefined,
  isEscapedRegexString,
  escapeRegexString,
  filterByRegex
} from 'js/view/components/helpers/regexHelper.js';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.windowedList = React.createRef();
    this.state = {
      escapeRegexSequence: '@'
    };
  }

  scrollToBottom = (el, list) => {
    el.scrollAround(list.length);
  };

  componentDidUpdate() {
    if (this.props.tailSwitch)
      this.scrollToBottom(this.windowedList.current, this.props.liveLines);
  }

  parseRegex = (input, escapePrefix) => {
    const regexString = isEscapedRegexString(input, escapePrefix)
      ? escapeRegexString(input, escapePrefix)
      : input;
    return createRegexOrUndefined(regexString, 'i');
  };

  itemRenderer = (lines, regex) => {
    return (i, key) => {
      return (
        <LogLine
          key={key}
          index={i}
          wrap={this.props.wrapLineOn ? 'true' : undefined}
        >
          {regex && regex.test(lines[i], regex) ? (
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
    const highlightRegex = this.parseRegex(
      this.props.highlightInput,
      this.state.escapeRegexSequence
    );
    const filterRegex = this.parseRegex(
      this.props.filterInput,
      this.state.escapeRegexSequence
    );
    const lines = filterByRegex(this.props.liveLines, filterRegex);

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
            itemRenderer={this.itemRenderer(lines, highlightRegex)}
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
