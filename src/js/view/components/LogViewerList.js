import React from 'react';
import {
  LogViewerListContainer,
  LogLine,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import {
  calculateSize,
  calculateWrap,
  maxLengthReducer
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

    this.state = {
      cachedCharSize: [0, 0],
      cachedLines: new CachedTransformedList(this.filterLinesFunc()),
      cachedHeightsByLength: new CachedReducedValue(
        this.heightByLengthReduceFunc([0, 0], 1),
        {}
      ),
      cachedLongestLine: new CachedReducedValue(maxLengthReducer, 0),
      cachedClientWidth: 0
    };
  }

  heightByLengthReduceFunc = (charSize, elementWidth) => {
    return (map, next) => {
      const key = next.length;
      if (map[key]) return map; // No need to recalculate

      const height = calculateWrap(next, charSize, elementWidth);
      const mapCopy = { ...map };
      mapCopy[key] = height;
      return mapCopy;
    };
  };

  filterLinesFunc = regex => {
    return lines => {
      return regex ? filterByRegExp(lines, regex) : lines;
    };
  };

  componentDidMount() {
    this.setState({
      cachedCharSize: calculateSize('W', this.rulerRef.current)
    });

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.logRef.current);
  }

  componentWillUpdate(nextProps, nextState) {
    const lines = nextProps.lines;
    const charSize = nextState.cachedCharSize;
    const clientWidth = this.logRef.current.clientWidth;
    const filterArgs = [nextProps.filterRegExp];
    const sizeArgs = [charSize, clientWidth];

    if (
      (this.props.filterRegExp || {}).source !==
      (nextProps.filterRegExp || {}).source
    ) {
      this.refreshCaches(lines, filterArgs, sizeArgs);
    } else {
      this.updateCaches(lines);
    }
  }

  componentDidUpdate() {
    if (this.props.scrollToBottom) {
      this.scrollToBottom(
        this.windowedListRef.current,
        this.state.cachedLines.get().length - 1
      );
    }
  }

  componentWillUnmount() {
    this.resizeObserver.disconnect();
  }

  scrollToBottom = (el, index) => {
    el.scrollAround(index);
  };

  updateCaches = lines => {
    this.state.cachedLines.diffAppend(lines);
    this.state.cachedHeightsByLength.diffReduce(this.state.cachedLines.get());
    this.state.cachedLongestLine.diffReduce(this.state.cachedLines.get());
  };

  //The onResize function is debounced as the resize event occurs all the time while resizing the window
  onResize = _.debounce(() => {
    //The line heights needs to be recalculated on a resize
    const charSize = calculateSize('W', this.rulerRef.current);
    const clientWidth = this.logRef.current.clientWidth;
    const cachedLines = this.state.cachedLines;
    const cachedHeightsByLength = this.state.cachedHeightsByLength;

    cachedHeightsByLength.reset(
      this.heightByLengthReduceFunc(charSize, clientWidth)
    );
    cachedHeightsByLength.diffReduce(cachedLines.get());

    this.setState({
      cachedCharSize: charSize,
      cachedClientWidth: clientWidth
    }); //This also re-renders, so if this is removed make sure to re-render
  }, 222);

  refreshCaches = (lines, filterArgs, sizeArgs) => {
    const cachedLines = this.state.cachedLines;
    const cachedHeightsByLength = this.state.cachedHeightsByLength;
    const cachedLongestLine = this.state.cachedLongestLine;

    cachedLines.reset(this.filterLinesFunc(...filterArgs));
    cachedHeightsByLength.reset(this.heightByLengthReduceFunc(...sizeArgs), {});
    cachedLongestLine.reset();
    cachedLines.diffAppend(lines);
    cachedHeightsByLength.diffReduce(cachedLines.get());
    cachedLongestLine.diffReduce(cachedLines.get());
  };

  wrapItemSizeGetter = (lines, sizes) => {
    return index => {
      return index < 0 ? 0 : sizes[lines[index].length];
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
    const sizes = this.state.cachedHeightsByLength.get();
    const lineWidth = this.props.wrapLines
      ? this.state.cachedClientWidth
      : this.state.cachedLongestLine.get() * this.state.cachedCharSize[1];

    const itemSizeGetter = this.props.wrapLines
      ? this.wrapItemSizeGetter(lines, sizes)
      : this.noWrapItemSizeGetter(this.state.cachedCharSize[0]);

    return (
      <LogViewerListContainer ref={this.logRef}>
        <LogLineRuler ref={this.rulerRef} />
        <WindowedList
          ref={this.windowedListRef}
          itemRenderer={(i, key) => {
            return (
              <LogLine
                key={key}
                index={i}
                minSize={0}
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
