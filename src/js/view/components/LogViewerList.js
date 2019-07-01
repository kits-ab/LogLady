import React, { useState, useRef, useEffect } from 'react';
import {
  LogViewerListContainer,
  LogLine,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import {
  getRectSize,
  maxLengthReducer
} from 'js/view/components/helpers/measureHelper';
import {
  createRegexReducer,
  createHeightReducer,
  scrollToBottom
} from 'js/view/components/helpers/logHelper';
import _ from 'lodash';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';

/** Custom hook for a reduced value cache that only
 * reduces further values if the list supplied to
 * reduce is longer than the previous length */
const useCache = v => {
  const [length, setLength] = useState(0);
  const [value, setValue] = useState(v);

  const reduce = (reducer, list) => {
    if (list.length <= length) return;
    const items = list.slice(length);
    setValue(items.reduce(reducer, value));
    setLength(list.length);
  };

  const reset = v => {
    setValue(v);
    setLength(0);
  };

  return [value, reduce, reset];
};

const LogViewerList = props => {
  const logRef = useRef();
  const listRef = useRef();
  const rulerRef = useRef();

  const clientWidth = logRef.current && logRef.current.clientWidth;
  const charSize = rulerRef.current && getRectSize(rulerRef.current);

  const [lines, linesReduce, linesReset] = useCache([]);
  const [heights, heightsReduce, heightsReset] = useCache({});
  const [maxLength, maxLengthReduce, maxLengthReset] = useCache(0);

  const updateCaches = () => {
    linesReduce(createRegexReducer(props.filterRegExp), props.lines);
    maxLengthReduce(maxLengthReducer, lines);
    heightsReduce(createHeightReducer(charSize, clientWidth), lines);
  };

  const resetCaches = (reset = {}) => {
    if (reset.lines !== false) linesReset([]);
    if (reset.heights !== false) heightsReset({});
    if (reset.maxLength !== false) maxLengthReset(0);
  };

  const getLineWidth = () => {
    return props.wrapLines || !charSize ? clientWidth : maxLength * charSize[1];
  };

  useEffect(() => {
    const onResize = _.debounce(() => {
      resetCaches({ lines: false });
    }, 222);

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    resetCaches();
  }, [props.filterRegExp]);

  useEffect(() => {
    if (charSize && clientWidth) updateCaches();
  });

  useEffect(() => {
    if (props.scrollToBottom && lines.length > 0)
      scrollToBottom(listRef.current, lines);
  });

  const heightGetter = index => {
    return index >= 0 && props.wrapLines
      ? heights[lines[index].length]
      : charSize[0];
  };

  return (
    <LogViewerListContainer ref={logRef}>
      <LogLineRuler ref={rulerRef}>W</LogLineRuler>
      <WindowedList
        ref={listRef}
        itemRenderer={(i, key) => {
          const line = lines[i];
          return (
            <LogLine
              key={key}
              index={i}
              minSize={0}
              fixedWidth={getLineWidth()}
              fixedHeight={heightGetter(i)}
              wrap={props.wrapLines ? 'true' : undefined}
            >
              {props.highlightRegExp && props.highlightRegExp.test(line) ? (
                <TextHighlightRegex
                  text={line}
                  color={props.highlightColor}
                  regex={props.highlightRegExp}
                />
              ) : (
                line
              )}
            </LogLine>
          );
        }}
        itemSizeGetter={heightGetter}
        length={lines.length}
        type="variable"
      />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
