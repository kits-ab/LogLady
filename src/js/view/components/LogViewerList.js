/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { VariableSizeList } from 'react-window';
import {
  LogViewerListContainer,
  LogLine,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import TextHighlightRegex from './TextHighlightRegex';

import _ from 'lodash';

const LogViewerList = props => {
  const variableSizeListRef = useRef(); // Reference to the React List component. Used for calling the lists functions to reset the cache of sizes
  const variableSizeListOuterRef = useRef(); // Reference to the actual DOM element. Used for manually scrolling to the bottom

  const [logLineElementWidth, setLogLineElementWidth] = useState(1); // Used to set and change the width the LogLine elements should be
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
    // Update the width to use for the list to fit the longest line if wraplines isn't set
    setLogLineElementWidth(
      props.wrapLines
        ? listDimensions.width
        : maxLineLength * characterDimensions.width
    );
    // Clear the list's cache of all item sizes
    variableSizeListRef.current &&
      variableSizeListRef.current.resetAfterIndex(0);
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
      variableSizeListOuterRef.current.scrollTop =
        variableSizeListOuterRef.current.scrollHeight;
    }
  }, [props.lines]);

  /**
   * Returns the row height needed for an item at position index, based on if it should wrap lines and how many characters fit in the window
   * @function
   * @param {Number} index - the index of the item
   * @returns The rowheight to use, in pixels.
   */
  const getItemSizeAtPosition = index => {
    if (props.wrapLines) {
      // Replace all of the stuff hiddenWindow has added to it, as they shouldn't count towards the length of the string
      let lineWithoutExtrasLength = props.lines[index].replace(
        /\[\/?HL[LG\d]*\]/g,
        ''
      ).length;
      return (
        Math.round(
          (lineWithoutExtrasLength * characterDimensions.width) /
            logLineElementWidth
        ) * characterDimensions.height
      );
    } else {
      return characterDimensions.height;
    }
  };

  /**
   * Component for rendering a single line based on the index React-window sends as argument.
   * I wanted to use Memoization to improve performance on this, but every element got rerendered and mounted whenever a line was added, even though the args didn't change.
   */
  const SingleLogLineRenderer = ({ index, style }) => {
    let line = props.lines[index];
    return (
      <LogLine
        style={{
          ...style,
          width: logLineElementWidth + 'px'
        }}
        wrap={props.wrapLines ? 'true' : undefined}
      >
        {/^\[HLL\].*\[\/HLL\]$/.test(line) ? (
          <TextHighlightRegex text={line} color={props.highlightColor} />
        ) : (
          <span>{line}</span>
        )}
      </LogLine>
    );
  };

  return (
    <LogViewerListContainer ref={logViewerListContainerRef}>
      <LogLineRuler ref={oneCharacterSizeRef}>
        <span>A</span>
      </LogLineRuler>
      <VariableSizeList
        ref={variableSizeListRef}
        outerRef={variableSizeListOuterRef}
        width={listDimensions.width}
        height={listDimensions.height}
        itemCount={props.lines.length}
        itemSize={getItemSizeAtPosition}
      >
        {SingleLogLineRenderer}
      </VariableSizeList>
    </LogViewerListContainer>
  );
};

export default LogViewerList;
