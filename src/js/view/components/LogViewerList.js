import React from 'react';
import {
  LogViewerListContainer,
  LogLine
} from '../styledComponents/LogViewerListStyledComponents';
import {
  calculateSize,
  calculateWrap,
  maxLength
} from 'js/view/components/helpers/measureHelper';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';
import { filterByRegExp } from 'js/view/components/helpers/regexHelper.js';

class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.logRef = React.createRef();
    this.windowedListRef = React.createRef();
    this.rulerRef = React.createRef();
  }

  scrollToBottom = el => {
    el.scrollAround(this.lastIndex);
  };

  componentDidUpdate() {
    if (this.props.scrollToBottom) {
      this.scrollToBottom(this.windowedListRef.current);
    }
  }

  componentWillUpdate() {}

  itemSizeGetter = (lines, charSize, clientWidth) => {
    const sizes = lines.map(line => {
      return calculateWrap(charSize, line, clientWidth);
    });
    return index => {
      return sizes[index];
    };
  };

  constItemSizeGetter = size => {
    return index => {
      return size;
    };
  };

  render() {
    const lines = filterByRegExp(this.props.lines, this.props.filterRegex);

    this.lastIndex = lines.length - 1;
    const highlightRegex = this.props.highlightRegex;
    const wrapLines = this.props.wrapLines;
    const highlightColor = this.props.highlightColor;
    const charSize = this.rulerRef.current
      ? calculateSize('a', this.rulerRef.current)
      : [0, 0];

    const lineWidth =
      this.logRef.current && this.props.wrapLines
        ? this.logRef.current.clientWidth
        : maxLength(lines) * charSize[1];

    const itemSizeGetter = this.props.wrapLines
      ? this.itemSizeGetter(lines, charSize, this.logRef.current.clientWidth)
      : this.constItemSizeGetter(charSize[0]);

    return (
      <LogViewerListContainer ref={this.logRef}>
        <LogLine
          style={{
            visibility: 'hidden',
            minWidth: 0,
            position: 'absolute',
            display: 'inline-block'
          }}
          ref={this.rulerRef}
        />
        <WindowedList
          ref={this.windowedListRef}
          itemRenderer={(i, key) => {
            return (
              <LogLine
                key={key}
                index={i}
                fixedWidth={lineWidth}
                fixedHeight={itemSizeGetter(i)}
                wrap={wrapLines ? 'true' : undefined}
              >
                {highlightRegex && highlightRegex.test(lines[i]) ? (
                  <TextHighlightRegex
                    text={lines[i]}
                    color={highlightColor}
                    regex={highlightRegex}
                  />
                ) : (
                  lines[i]
                )}
              </LogLine>
            );
          }}
          itemSizeGetter={itemSizeGetter}
          length={lines.length}
          type="variable"
        />
      </LogViewerListContainer>
    );
  }
}

export default LogViewer;
