import React, { useState, useRef, useEffect } from 'react';
import {
  LogViewerListContainer,
  LogLine,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import {
  calculateSize,
  calculateWrappedHeight,
  maxLengthReducer
} from 'js/view/components/helpers/measureHelper';
import _ from 'lodash';
import TextHighlightRegex from './TextHighlightRegex';
import WindowedList from 'react-list';

const createHeightReducer = (charSize, elWidth) => {
  return (map, next) => {
    const key = next.length;
    if (map[key]) return map; // No need to recalculate

    const height = calculateWrappedHeight(next, charSize, elWidth);
    return { ...map, [key]: height };
  };
};

const createRegexReducer = regex => {
  return (lines, line) => {
    if (!regex || (regex && regex.test(line))) lines.push(line);
    return lines;
  };
};

const scrollToBottom = (el, list) => {
  el.scrollAround(list.length - 1);
};

const useListCache = v => {
  const [length, setLength] = useState(0);
  const [value, setValue] = useState(v);

  const cacheUpdate = (reducer, list) => {
    if (list.length <= length) return;
    const items = list.slice(length);
    setValue(items.reduce(reducer, value));
    setLength(list.length);
  };

  const cacheReset = v => {
    setValue(v);
    setLength(0);
  };

  return [value, cacheUpdate, cacheReset];
};

const LogViewerList = props => {
  const logRef = useRef();
  const listRef = useRef();
  const rulerRef = useRef();

  const [charSize, setCharSize] = useState([0, 0]);
  const [clientWidth, setClientWidth] = useState(1);
  const [lines, linesUpdate, linesReset] = useListCache([]);
  const [heights, heightsUpdate, heightsReset] = useListCache({});
  const [maxLength, maxLengthUpdate, maxLengthReset] = useListCache(0);

  const updateCaches = () => {
    linesUpdate(createRegexReducer(props.filterRegExp), props.lines);
    heightsUpdate(createHeightReducer(charSize, clientWidth), lines);
    maxLengthUpdate(maxLengthReducer, lines);
  };

  const refreshSizes = () => {
    if (!logRef.current || !rulerRef.current) return;

    setClientWidth(logRef.current.clientWidth);
    setCharSize(calculateSize('W', rulerRef.current));
  };

  const resetCaches = (ignore = {}) => {
    console.log("I'M RESETTING");
    if (!ignore.lines) linesReset([]);
    if (!ignore.heights) heightsReset({});
    if (!ignore.maxLength) maxLengthReset(0);
  };

  const onResize = _.debounce(() => {
    refreshSizes();
    resetCaches({ heights: true, maxLength: true });
  }, 222);

  useEffect(() => {
    if (props.scrollToBottom && listRef.current)
      scrollToBottom(listRef.current, lines);
  });

  useEffect(() => {
    refreshSizes();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    resetCaches();
  }, [props.filterRegExp]);

  useEffect(() => {
    updateCaches();
  });

  const width = props.wrapLines ? clientWidth : maxLength * charSize[1];

  const heightGetter = index => {
    return index >= 0 && props.wrapLines
      ? heights[lines[index].length]
      : charSize[0];
  };

  return (
    <LogViewerListContainer ref={logRef}>
      <LogLineRuler ref={rulerRef} />
      <WindowedList
        ref={listRef}
        itemRenderer={(i, key) => {
          const line = lines[i];
          return (
            <LogLine
              key={key}
              index={i}
              minSize={0}
              fixedWidth={width}
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
