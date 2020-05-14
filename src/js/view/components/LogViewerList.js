/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import { MemoedSingleLogLine } from './SingleLogLine';
import { LogLine } from '../styledComponents/LogViewerListStyledComponents';
import { List } from 'office-ui-fabric-react';
import _ from 'lodash';

const memoizeProps = memoize((highlightColor, shouldWrap) => {
  return {
    highlightColor,
    shouldWrap
  };
});

const isNotOnlyWhitespace = str => {
  return !(str.length === 1 && /\s/.test(str));
};

let indexOfMarkedHighlight = 0;

const LogViewerList = props => {
  const listRef = useRef();
  const containerRef = useRef();
  const [containerHeight, setContainerHeight] = useState(null);
  const [nbrOfItemsInView, setNbrOfItemsInView] = useState(0);
  const [measuredCharHeight, setMeasuredCharHeight] = useState(null);
  const previousIndex = useRef(0);

  // Used to send needed props and state from this component to the pure component that renders a single line
  const memoizedLineProps = memoizeProps(props.highlightColor, props.wrapLines);

  const evaluateNrOfItemsScrolled = indexOfTopItemInView => {
    // When the amount of items scrolled by are exceeding maxLineNrToScroll, a fetch of new lines from backend is triggered
    if (props.wholeFileNotInFeCache) {
      const startItemIndexDiff = indexOfTopItemInView - previousIndex.current;
      const maxLineNrToScroll = props.logLinesLength / 3;
      const timeToFetchNewLines =
        startItemIndexDiff > maxLineNrToScroll ||
        startItemIndexDiff < -maxLineNrToScroll;

      if (timeToFetchNewLines) {
        previousIndex.current = indexOfTopItemInView;

        const halvedLogLineLength = props.logLinesLength / 2;
        const indexForNewLines =
          indexOfTopItemInView - halvedLogLineLength < 0
            ? 0
            : Math.round(indexOfTopItemInView - halvedLogLineLength);
        props.getMoreLogLines(indexForNewLines);
      }
    }
  };

  useEffect(() => {
    // Force updates the List when the user toggles Wrap Lines
    listRef.current.forceUpdate();
  }, [props.wrapLines]);

  useEffect(() => {
    if (props.filterInput.length === 0) {
      const indexOfTopItemInView = Math.floor(
        props.scrollTop / measuredCharHeight
      );
      evaluateNrOfItemsScrolled(indexOfTopItemInView);
    }
  }, [props.scrollTop, props.filterInput]);

  useEffect(() => {
    // Updates the height of the container upon resize
    const handleResize = () => {
      setContainerHeight(containerRef.current.offsetHeight);
    };
    handleResize();
    // Debounce is used to limit the number of calls to the event handler so that it doesn't get spammed and risk impairing the UX
    const debouncedResizeHandler = _.debounce(handleResize, 200);
    window.addEventListener('resize', debouncedResizeHandler);
    return () => {
      window.removeEventListener('resize', debouncedResizeHandler);
    };
  }, []);

  useEffect(() => {
    // Effect that changes the scroll position if we search for a line that is not currently in view
    const indexOfTopItemInView = Math.floor(
      props.scrollTop / measuredCharHeight
    );
    const indexOfBottomItemInView = Math.floor(
      indexOfTopItemInView + nbrOfItemsInView
    );
    const markedItemNotInView =
      indexOfMarkedHighlight < indexOfTopItemInView ||
      indexOfMarkedHighlight > indexOfBottomItemInView;
    if (markedItemNotInView) {
      listRef.current.scrollToIndex(indexOfMarkedHighlight);
    }
  }, [props.markedHighlight]);

  useEffect(() => {
    // Calculates the number of items that is currently in the view
    setNbrOfItemsInView(Math.floor(containerHeight / measuredCharHeight));
  }, [containerHeight]);

  // Measure is used to measure the height of a character
  const Measure = ({ onMeasured }) => {
    const oneCharacterRef = useRef();

    useEffect(() => {
      onMeasured(oneCharacterRef.current.offsetHeight);
    }, [onMeasured, oneCharacterRef]);

    return <LogLineRuler ref={oneCharacterRef}>A</LogLineRuler>;
  };

  const _onRenderCell = (item, index) => {
    const { highlightColor, shouldWrap } = memoizedLineProps;
    let match;
    if (
      props.markedHighlight !== undefined &&
      item === props.markedHighlight[0]
    ) {
      indexOfMarkedHighlight = index;
      match = true;
    }
    return item && isNotOnlyWhitespace(item.sections[0].text) ? (
      <MemoedSingleLogLine
        index={index}
        line={item}
        highlightColor={highlightColor}
        match={match}
        shouldWrap={shouldWrap}
      />
    ) : (
      <LogLine emptyline index={index}>
        <span>&zwnj;</span>
      </LogLine>
    );
  };

  return (
    <LogViewerListContainer ref={containerRef}>
      {!measuredCharHeight && <Measure onMeasured={setMeasuredCharHeight} />}
      <List
        ref={listRef}
        items={props.lines}
        onRenderCell={_onRenderCell}
        style={{ display: 'inline-block', minWidth: '100%' }}
        version={props.markedHighlight}
      />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
