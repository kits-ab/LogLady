import React from 'react';
import {
  LogViewContainer,
  CloseFileButton,
  Log,
  LogLine
} from '../styledComponents/LogViewerStyledComponents';
import { connect } from 'react-redux';
import { closeFile } from './helpers/handleFileHelper';
import {
  calculateSize,
  calculateWrap,
  maxLength
} from 'js/view/components/helpers/measureHelper';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';
import {
  filterByRegExp,
  parseRegExp
} from 'js/view/components/helpers/regexHelper.js';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.logRef = React.createRef();
    this.windowedListRef = React.createRef();
    this.rulerRef = React.createRef();
    this.state = {
      escapeRegexSequence: '@'
    };
  }

  scrollToBottom = el => {
    el.scrollAround(this.lastIndex);
  };

  componentDidUpdate() {
    if (this.props.tailSwitch) {
      // this.scrollToBottom(this.logRef.current);
      this.scrollToBottom(this.windowedListRef.current);
    }
  }

  updateSizes() {}

  itemRenderer = (lineWidth, lines, regex) => {
    return (i, key) => {
      return (
        <LogLine
          key={key}
          index={i}
          fixedWidth={lineWidth}
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

  itemSizeGetter = sizes => {
    return index => {
      return sizes[index];
    };
  };

  render() {
    const highlightRegex = parseRegExp(
      this.props.highlightInput,
      this.state.escapeRegexSequence
    );
    const filterRegex = parseRegExp(
      this.props.filterInput,
      this.state.escapeRegexSequence
    );

    const lines = filterByRegExp(this.props.liveLines, filterRegex);

    this.lastIndex = lines.length - 1;

    let charSize = [0, 0];

    if (this.rulerRef.current) {
      charSize = calculateSize('a', this.rulerRef.current);
    }

    let lineWidth = this.logRef.current
      ? this.logRef.current.clientWidth
      : maxLength(lines) * charSize[0];

    let itemSizeGetter = () => {
      return charSize[0];
    };

    if (this.props.wrapLineOn) {
      const sizes = lines.map(line => {
        return calculateWrap(charSize, line, this.logRef.current.clientWidth);
      });
      itemSizeGetter = this.itemSizeGetter(sizes);
    }

    const itemRenderer = this.itemRenderer(lineWidth, lines, highlightRegex);

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
        <Log ref={this.logRef}>
          <LogLine
            style={{
              visibility: 'hidden',
              minWidth: 0,
              display: 'inline-block'
            }}
            ref={this.rulerRef}
          />
          <WindowedList
            ref={this.windowedListRef}
            itemRenderer={itemRenderer}
            itemSizeGetter={itemSizeGetter}
            length={lines.length}
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
