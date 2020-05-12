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

const memoizeProps = memoize((highlightColor, shouldWrap) => {
  return {
    highlightColor,
    shouldWrap
  };
});

const isNotOnlyWhitespace = str => {
  return !(str.length === 1 && /\s/.test(str));
};

const LogViewerList = props => {
  const listRef = useRef();
  const [measuredCharHeight, setMeasuredCharHeight] = useState(null);
  const previousIndex = useRef(0);
  let indexOfCurrentMarkedHighlight = {};

  // Used to send needed props and state from this component to the pure component that renders a single line
  const memoizedLineProps = memoizeProps(props.highlightColor, props.wrapLines);

  const evaluateNrOfItemsScrolled = scrollTop => {
    // When the amount of items scrolled by are exceeding maxLineNrToScroll, a fetch of new lines from backend is triggered
    if (props.wholeFileNotInFeCache) {
      const indexOfTopItemInView = Math.floor(scrollTop / measuredCharHeight);
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
    //Force updates the List when the user toggles Wrap Lines
    listRef.current.forceUpdate();
  }, [props.wrapLines]);

  useEffect(() => {
    if (props.filterInput.length === 0) {
      evaluateNrOfItemsScrolled(props.scrollTop);
    }
  }, [props.scrollTop, props.filterInput]);

  // Measure is used to measure the height of a character
  const Measure = ({ onMeasured }) => {
    const oneCharacterRef = useRef();

    useEffect(() => {
      onMeasured(oneCharacterRef.current.offsetHeight);
    }, [onMeasured, oneCharacterRef]);

    return <LogLineRuler ref={oneCharacterRef}>A</LogLineRuler>;
  };

  useEffect(() => {
    listRef.current.scrollToIndex(indexOfCurrentMarkedHighlight);
  }, [props.highlightMarker]);

  const _onRenderCell = (item, index) => {
    const { highlightColor, shouldWrap } = memoizedLineProps;
    let match;
    if (item === props.highlightMarker[0]) {
      indexOfCurrentMarkedHighlight = { index };
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
    <LogViewerListContainer>
      {!measuredCharHeight && <Measure onMeasured={setMeasuredCharHeight} />}
      <List
        ref={listRef}
        items={props.lines}
        onRenderCell={_onRenderCell}
        style={{ display: 'inline-block', minWidth: '100%' }}
      />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
