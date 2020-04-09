/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';
import { updateNumberOfLinesToRenderInLogView } from '../actions/dispatchActions';
import { List } from 'office-ui-fabric-react';

const createItemData = memoize((lines, highlightColor, shouldWrap) => {
  return {
    lines,
    highlightColor,
    shouldWrap
  };
});

const LogViewerList = props => {
  const [measuredCharHeight, setMeasuredCharHeight] = useState(null);
  const [nbrOfLinesToFillLogView, setNbrOfLinesToFillLogView] = useState(null);

  //listRef is used to call upon forceUpdate on the List object when wrap lines is toggled
  const listRef = useRef();

  // Itemdata used to send needed props and state from this component to the pure component that renders a single line
  const itemData = createItemData(
    props.lines,
    props.highlightColor,
    props.wrapLines
  );

  useEffect(() => {
    // Calculating the amount of lines needed to fill the page in the logviewer
    setNbrOfLinesToFillLogView(
      Math.round(props.containerHeight / measuredCharHeight)
    );
  }, [props.containerHeight, measuredCharHeight]);

  useEffect(() => {
    updateNumberOfLinesToRenderInLogView(
      props.dispatcher,
      nbrOfLinesToFillLogView
    );
  }, [nbrOfLinesToFillLogView]);

  useEffect(() => {
    //Force updates the List when the user toggles Wrap Lines
    listRef.current.forceUpdate();
  }, [props.wrapLines]);

  // Measure is a component that is used to measure the height of a character
  const Measure = ({ onMeasured }) => {
    const oneCharacterRef = useRef();

    useEffect(() => {
      onMeasured(oneCharacterRef.current.offsetHeight);
    }, [onMeasured, oneCharacterRef]);

    return <LogLineRuler ref={oneCharacterRef}>A</LogLineRuler>;
  };

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
