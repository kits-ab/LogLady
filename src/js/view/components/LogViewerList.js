import React from 'react';
import {
  LogViewerListContainer,
  LogLine
} from '../styledComponents/LogViewerListStyledComponents';
import {
  calculateSize,
  calculateWrap
} from 'js/view/components/helpers/measureHelper';
import _ from 'lodash';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';
import { filterByRegExp } from 'js/view/components/helpers/regexHelper.js';
import {
  CachedTransformedList,
  CachedReducedValue
} from 'js/view/components/helpers/cacheHelper.js';

class LogViewerList extends React.Component {
  constructor(props) {
    super(props);
    this.logRef = React.createRef();
    this.windowedListRef = React.createRef();
    this.rulerRef = React.createRef();

    const filterLines = (lines, { regex }) => {
      return regex ? filterByRegExp(lines, regex) : lines;
    };

    const calculateSizes = (lines, { charSize, clientWidth }) => {
      return lines.map(line => {
        return calculateWrap(line, charSize, clientWidth);
      });
    };

    const reduceLongestLine = () => {
      return (max, next) => {
        return max > next.length ? max : next.length;
      };
    };

    this.state = {
      cachedCharSize: [0, 0],
      cachedLines: new CachedTransformedList(filterLines),
      cachedLineHeights: new CachedTransformedList(calculateSizes),
      cachedLongestLine: new CachedReducedValue(reduceLongestLine, 0),
      cachedClientWidth: 0
    };
  }

  componentDidMount() {
    this.setState({
      cachedCharSize: calculateSize('W', this.rulerRef.current)
    });

    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentDidUpdate() {
    if (this.props.scrollToBottom) {
      this.scrollToBottom(
        this.windowedListRef.current,
        this.state.cachedLines.get().length - 1
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const lines = nextProps.lines;
    const charSize = nextState.cachedCharSize;
    const clientWidth = this.logRef.current.clientWidth;
    const filterArgs = { regex: nextProps.filterRegExp };
    const sizeArgs = { charSize, clientWidth };

    if (this.props.filterRegExp !== nextProps.filterRegExp) {
      this.refreshCaches(lines, filterArgs, sizeArgs);
    } else {
      this.updateCaches(lines, filterArgs, sizeArgs);
    }
  }

  scrollToBottom = (el, index) => {
    el.scrollAround(index);
  };

  updateCaches = (lines, filterArgs, sizeArgs) => {
    this.state.cachedLines.update(lines, filterArgs);
    this.state.cachedLineHeights.update(this.state.cachedLines.get(), sizeArgs);
    this.state.cachedLongestLine.update(this.state.cachedLines.get());
  };

  //The onResize function is debounced as the resize event occurs all the time while resizing the window
  onResize = _.debounce(() => {
    //The line heights needs to be recalculated on a resize
    const charSize = calculateSize('W', this.rulerRef.current);
    const clientWidth = this.logRef.current.clientWidth;
    const cachedLines = this.state.cachedLines;
    const cachedLineHeights = this.state.cachedLineHeights;

    cachedLineHeights.reset();
    cachedLineHeights.update(cachedLines.get(), { charSize, clientWidth });

    this.setState({
      cachedCharSize: charSize,
      cachedClientWidth: this.logRef.current.clientWidth
    }); //This also re-renders, so if this is removed make sure to re-render
  }, 222);

  refreshCaches = (lines, filterArgs, sizeArgs) => {
    const cachedLines = this.state.cachedLines;
    const cachedLineHeights = this.state.cachedLineHeights;
    const cachedLongestLine = this.state.cachedLongestLine;

    cachedLines.reset();
    cachedLineHeights.reset();
    cachedLines.update(lines, filterArgs);
    cachedLineHeights.update(cachedLines.get(), sizeArgs);
    cachedLongestLine.reset();
    cachedLongestLine.update(cachedLines.get());
  };

  wrapItemSizeGetter = sizes => {
    return index => {
      return sizes[index];
    };
  };

  noWrapItemSizeGetter = size => {
    return index => {
      return size;
    };
  };

  render() {
    const highlightRegExp = this.props.highlightRegExp;
    const wrapLines = this.props.wrapLines;
    const highlightColor = this.props.highlightColor;
    const lines = this.state.cachedLines.get();
    const sizes = this.state.cachedLineHeights.get();
    const lineWidth = this.props.wrapLines
      ? this.state.cachedClientWidth
      : this.state.cachedLongestLine.get() * this.state.cachedCharSize[1];

    const itemSizeGetter = this.props.wrapLines
      ? this.wrapItemSizeGetter(sizes)
      : this.noWrapItemSizeGetter(this.state.cachedCharSize[0]);

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
                {highlightRegExp && highlightRegExp.test(lines[i]) ? (
                  <TextHighlightRegex
                    text={lines[i]}
                    color={highlightColor}
                    regex={highlightRegExp}
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

export default LogViewerList;
