/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';
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

  const listRef = useRef();
  const startItemIndexOnLastFetchRef = useRef();

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
      let lineWithoutExtrasLength =
        props.lines[index] !== null
          ? props.lines[index].replace(/\[\/?HL[LG\d]+\]/g, '').length
          : '';
      if (lineWithoutExtrasLength > currentMaxLength) {
        currentMaxLength = lineWithoutExtrasLength;
      }
    }

    setCurrentMaxLineLength(currentMaxLength);
    setLastLineCount(index);
  }, [props.lines]);

  useEffect(() => {
    // Effect for setting the initial startItemIndex when opening a file.
    const nrOfLinesInViewer = Math.round(
      listDimensions.height / characterDimensions.height
    );
    startItemIndexOnLastFetchRef.current =
      props.lines.length - nrOfLinesInViewer;
    // console.log({
    //   initialStartItemIndex: startItemIndexOnLastFetchRef.current
    // });
  }, [listDimensions.height, props.sourcePath]);

  useEffect(() => {
    // In this effect the amount of lines scrolled in either direction are evaluated and if exceeding a certain amount, new lines will be fetched from the backend cache.
    const startItemIndexinView = listRef.current.getStartItemIndexInView();

    const totalFileContentIsNotInTheFrontendCache =
      props.logLinesLength !== props.lines.length;
    const theLineArraysAreLongerThanZero =
      props.logLinesLength > 0 && props.lines.length > 0;
    // console.log({
    //   totalFileContentIsNotInTheFrontendCache,
    //   theLineArraysAreLongerThanZero
    // });

    // A fetch of new lines should only be triggered if the total file content is not contained in the list of lines.
    if (
      totalFileContentIsNotInTheFrontendCache &&
      theLineArraysAreLongerThanZero
    ) {
      const currentAndLastStartItemIndexDiff =
        startItemIndexinView - startItemIndexOnLastFetchRef.current;
      console.log({ currentAndLastStartItemIndexDiff });
      const halvedLogLinesLength = props.logLinesLength / 2;

      if (
        currentAndLastStartItemIndexDiff > halvedLogLinesLength ||
        currentAndLastStartItemIndexDiff < -halvedLogLinesLength
      ) {
        // Update the ref with the current startItemIndexInView value for comparing against the new position after fetching new lines.
        startItemIndexOnLastFetchRef.current = startItemIndexinView;

        const feCacheIndexForNewLines =
          startItemIndexinView - halvedLogLinesLength < 0
            ? 0
            : Math.round(startItemIndexinView - halvedLogLinesLength);

        props.getMoreLogLines(
          props.logLinesLength,
          props.lines.length,
          feCacheIndexForNewLines
        );
      }
    }
  }, [props.scrollTop]);

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
      <List ref={listRef} items={props.lines} onRenderCell={_onRenderCell} />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
