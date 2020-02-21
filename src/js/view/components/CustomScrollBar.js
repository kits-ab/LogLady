import React from 'react';
import { Slider } from 'office-ui-fabric-react';
import { ScrollBarContainer } from '../styledComponents/LogViewerStyledComponents';

/*
Custom scroll bar created from fabric-ui slider component.
With this we are able to connect the position of the slider thumb to specific bytes in the file. 
*/

// Object with all the values that can be overridden in the slider component
const overrideStyles = {
  activeSection: {},
  container: {},
  inactiveSection: {},
  line: {},
  lineContainer: {},
  root: {},
  slideBox: {},
  thumb: {},
  titleLabel: {},
  valueLabel: {},
  zeroTick: {}
};

const CustomScrollBar = props => {
  return (
    <ScrollBarContainer>
      <Slider
        min={0}
        max={props.logSize}
        onChange={value => {
          props.handleOnChange(value);
        }}
        showValue={false}
        step={props.step}
        styles={overrideStyles}
        value={props.scrollPosition}
        vertical
      />
    </ScrollBarContainer>
  );
};

export default CustomScrollBar;
