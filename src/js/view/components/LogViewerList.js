/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import memoize from 'memoize-one';
import { LogViewerListContainer } from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';
import { List } from 'office-ui-fabric-react';

const createItemData = memoize((lines, highlightColor, shouldWrap) => {
  return {
    lines,
    highlightColor,
    shouldWrap
  };
});

const LogViewerList = props => {
  const listRef = useRef(); //listRef is used to call upon forceUpdate on the List object when wrap lines is toggled
  const startItemIndexRef = useRef(0);

  // Itemdata used to send needed props and state from this component to the pure component that renders a single line
  const itemData = createItemData(
    props.lines,
    props.highlightColor,
    props.wrapLines
  );

  useEffect(() => {
    //Force updates the List when the user toggles Wrap Lines
    listRef.current.forceUpdate();
  }, [props.wrapLines]);

  useEffect(() => {
    // In this effect the amount of lines scrolled in either direction are evaluated
    // and if exceeding a certain amount, new lines will be fetched from the backend cache.

    const startItemIndexinView = listRef.current.getStartItemIndexInView();

    // A fetch of new lines should only be triggered if the total file content is not contained in the list of lines.
    if (props.wholeFileNotInFeCache) {
      const startItemIndexDiff =
        startItemIndexinView - startItemIndexRef.current;
      console.log({ startItemIndexDiff });
      const maxLineNrToScroll = props.logLinesLength / 3;

      if (
        startItemIndexDiff > maxLineNrToScroll ||
        startItemIndexDiff < -maxLineNrToScroll
      ) {
        startItemIndexRef.current = startItemIndexinView;

        const halvedLogLineLength = props.logLinesLength / 2;
        const indexForNewLines =
          startItemIndexinView - halvedLogLineLength < 0
            ? 0
            : Math.round(startItemIndexinView - halvedLogLineLength);

        props.getMoreLogLines(indexForNewLines);
      }
    }
  }, [props.scrollTop]);

  const _onRenderCell = (item, index) => {
    return (
      <SingleLogLineTranslator
        data={itemData}
        index={index}
      ></SingleLogLineTranslator>
    );
  };

  return (
    <LogViewerListContainer>
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
