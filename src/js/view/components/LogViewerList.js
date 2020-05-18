/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from 'react';
import memoize from 'memoize-one';
import { LogViewerListContainer } from '../styledComponents/LogViewerListStyledComponents';
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
  const listRef = useRef(); //listRef is used to call upon forceUpdate on the List object when wrap lines is toggled
  const startItemIndexRef = useRef(0);
  // Used to send needed props and state from this component to the pure component that renders a single line
  const memoizedLineProps = memoizeProps(props.highlightColor, props.wrapLines);

  const evaluateNrOfItemsScrolled = startItemIndexinView => {
    // When the amount of items scrolled by are exceeding maxLineNrToScroll, a fetch of new lines from backend is triggered
    if (props.wholeFileNotInFeCache) {
      const startItemIndexDiff =
        startItemIndexinView - startItemIndexRef.current;
      const maxLineNrToScroll = props.logLinesLength / 3;
      const timeToGetNewLines =
        startItemIndexDiff > maxLineNrToScroll ||
        startItemIndexDiff < -maxLineNrToScroll;

      if (timeToGetNewLines) {
        startItemIndexRef.current = startItemIndexinView;

        const halvedLogLineLength = props.logLinesLength / 2;
        const indexForNewLines =
          startItemIndexinView - halvedLogLineLength < 0
            ? 0
            : Math.round(startItemIndexinView - halvedLogLineLength);

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
      const indexOfTopItemInView = listRef.current.getStartItemIndexInView();
      evaluateNrOfItemsScrolled(indexOfTopItemInView);
    }
  }, [props.scrollTop, props.filterInput, props.tabChanged]);

  const _onRenderCell = (item, index) => {
    const { highlightColor, shouldWrap } = memoizedLineProps;
    return item && isNotOnlyWhitespace(item.sections[0].text) ? (
      <MemoedSingleLogLine
        index={index}
        line={item}
        highlightColor={highlightColor}
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
      {/* {!measuredCharHeight && <Measure onMeasured={setMeasuredCharHeight} />} */}
      <List
        ref={listRef}
        items={props.lines}
        onRenderCell={_onRenderCell}
        style={{
          display: 'inline-block',
          minWidth: '100%'
        }}
        version={props.markedHighlight}
      />
    </LogViewerListContainer>
  );
};

export default LogViewerList;
