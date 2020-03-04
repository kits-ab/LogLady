import React from 'react';
import { Slider } from 'office-ui-fabric-react';

/*
Custom scrollbar created from fabric-ui slider component.
With this we are able to connect the position of the slider thumb to specific bytes in the file. 
*/

const CustomScrollBar = props => {
  // All elements of the slider that can have their styles overridden.
  const overrideStyles = {
    activeSection: { backgroundColor: 'transparent' },
    container: {},
    inactiveSection: { backgroundColor: 'transparent' },
    line: {},
    lineContainer: {},
    root: {
      marginRight: '0px'
    },
    slideBox: {
      paddingTop: '0px',
      width: '20px',
      selectors: {
        ':hover': {}
      }
    },
    thumb: {
      backgroundColor: 'rgb(200, 198, 196)',
      border: 'none',
      borderRadius: 'none',
      height: '20px',
      transform: 'translateY(0px)',
      selectors: {
        ':hover': {
          backgroundColor: 'darkGrey',
          border: 'none'
        }
      }
    },
    titleLabel: {},
    valueLabel: {},
    zeroTick: {}
  };

  return (
    <Slider
      min={props.min}
      max={props.max}
      onChange={value => {
        props.handleOnChange(value);
      }}
      showValue={false}
      step={props.step}
      styles={overrideStyles}
      value={props.value}
      vertical
    />
  );
};

export default CustomScrollBar;
