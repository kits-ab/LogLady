/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import memoize from 'memoize-one';
import {
  LogViewerListContainer,
  LogLineRuler
} from '../styledComponents/LogViewerListStyledComponents';
import SingleLogLineTranslator from './SingleLogLine';
import { updateNumberOfLinesToRenderInLogView } from '../actions/dispatchActions';
import _ from 'lodash';
import { List } from 'office-ui-fabric-react';

const createItemData = memoize((lines, highlightColor, shouldWrap) => {
  return {
    lines,
    highlightColor,
    shouldWrap
  };
});

const LogViewerList = props => {
  //listRef is used to call upon forceUpdate on the List object when wrap lines is toggled
  const listRef = useRef();

  const logViewerListContainerRef = useRef();

  const oneCharacterSizeRef = useRef();
  const [characterDimensions, setCharacterDimensions] = useState({
    height: 19
  });

  const [numberOfLinesToFillLogView, setNumberOfLinesToFillLogView] = useState(
    Math.round(props.containerHeight / characterDimensions.height)
  );

  // Itemdata used to send needed props and state from this component to the pure component that renders a single line
  const itemData = createItemData(
    props.lines,
    props.highlightColor,
    props.wrapLines
  );

  useEffect(() => {
    // Handler to update the dimensions when needed
    const handleResize = () => {
      setCharacterDimensions({
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
    // Calculating the amount of lines needed to fill the page in the logviewer
    setNumberOfLinesToFillLogView(
      Math.round(props.containerHeight / characterDimensions.height)
    );
  }, [props.containerHeight, characterDimensions]);

  useEffect(() => {
    updateNumberOfLinesToRenderInLogView(
      props.dispatcher,
      numberOfLinesToFillLogView
    );
  }, [numberOfLinesToFillLogView]);

  useEffect(() => {
    //Force updates the List when the user toggles Wrap Lines
    listRef.current.forceUpdate();
  }, [props.wrapLines]);

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
