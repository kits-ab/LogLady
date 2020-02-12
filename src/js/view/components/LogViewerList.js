/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';
import { fetchTextBasedOnByteFromScrollPosition } from './helpers/logHelper';

import _ from 'lodash';
import { List } from 'office-ui-fabric-react';

const createItemData = memoize(
  (lines, highlightColor, elementWidth, shouldWrap) => {
    return {
      lines,
      highlightColor,
      elementWidth,
      shouldWrap
    };
  }
);

const LogViewerList = props => {
  const [logLineElementWidth, setLogLineElementWidth] = useState(1); // Used to save and set the width the LogLine elements should be
  const [maxLineLength, setCurrentMaxLineLength] = useState(1); // Used to save and update how many characters the longest line has
  const [lastLineCount, setLastLineCount] = useState(0); // Used to keep track of how many lines there were last render, for optimizing mainly calculation of new lines

  const logViewerListContainerRef = useRef();
  const [listDimensions, setListDimensions] = useState({
    width: 575,
    height: 145
  });

  const oneCharacterSizeRef = useRef();
  const [characterDimensions, setCharacterDimensions] = useState({
    width: 10,
    height: 19
  });

  // Itemdata used to send needed props and state from this component to the pure component that renders a single line
  const itemData = createItemData(
    props.lines,
    props.highlightColor,
    logLineElementWidth,
    props.wrapLines
  );

  useEffect(() => {
    // Handler to update the dimensions when needed
    const handleResize = () => {
      setListDimensions({
        width: logViewerListContainerRef.current.offsetWidth,
        height: logViewerListContainerRef.current.offsetHeight
      });

      setCharacterDimensions({
        width: oneCharacterSizeRef.current.offsetWidth,
        height: oneCharacterSizeRef.current.offsetHeight
      });
    };
    handleResize();

    // Calls are throttled to once every 200 ms
    const debouncedResizeHandler = _.debounce(handleResize, 200);

    window.addEventListener('resize', debouncedResizeHandler);

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  useEffect(() => {
    // Handler for reacting to scroll events
    const debouncedScrollHandler = _.debounce(() => {
      if (logViewerListContainerRef.current) {
        // Calculate what percantage of the file we have scrolled to
        const scrollPercentage =
          logViewerListContainerRef.current.scrollTop /
          logViewerListContainerRef.current.scrollHeight;
        // Calculate what byte to fetch from
        const byteToFetchFrom = Math.round(props.logSize * scrollPercentage);

        fetchTextBasedOnByteFromScrollPosition(
          props.sourcePath,
          byteToFetchFrom,
          10
        );
      }
    }, 200);

    logViewerListContainerRef.current.addEventListener(
      'scroll',
      debouncedScrollHandler
    );

    // Return cleanup function
    return () => {
      logViewerListContainerRef.current.removeEventListener(
        'scroll',
        debouncedScrollHandler
      );
    };
    // Rerun effect when logSize updates so the handler is correclty updated
    // Only running once gives the handler the incorrect logsize and thus it
    // will not work
  }, [props.logSize]);

  useEffect(() => {
    // Update the width to use for the list to fit the longest line if wraplines isn't set
    setLogLineElementWidth(
      props.wrapLines
        ? listDimensions.width
        : maxLineLength * characterDimensions.width
    );
  }, [
    props.wrapLines,
    maxLineLength,
    listDimensions.width,
    characterDimensions.width
  ]);

  useEffect(() => {
    let currentMaxLength = maxLineLength;
    let index = lastLineCount;
    for (; index < props.lines.length; index++) {
      // Remove all of the stuff hiddenWindow has added to it, as they shouldn't count towards the length of the string
      let lineWithoutExtrasLength = props.lines[index].replace(
        /\[\/?HL[LG\d]+\]/g,
        ''
      ).length;
      if (lineWithoutExtrasLength > currentMaxLength) {
        currentMaxLength = lineWithoutExtrasLength;
      }
    }

    setCurrentMaxLineLength(currentMaxLength);
    setLastLineCount(index);

    if (props.scrollToBottom) {
      logViewerListContainerRef.current.scrollTop =
        logViewerListContainerRef.current.scrollHeight;
    }
  }, [props.lines]);

  const _onRenderCell = (item, index) => {
    return (
      <SingleLogLineTranslator
        data={itemData}
        index={index}
        style={{ willChange: 'unset' }}
      ></SingleLogLineTranslator>
    );
  };

  return (
    <LogViewerListContainer ref={logViewerListContainerRef}>
      <LogLineRuler ref={oneCharacterSizeRef}>
        <span>A</span>
      </LogLineRuler>
      <List items={props.lines} onRenderCell={_onRenderCell} />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
