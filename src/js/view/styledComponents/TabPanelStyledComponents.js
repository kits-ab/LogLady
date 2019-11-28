import styled from 'styled-components';

export const Tab = styled.div`
  cursor: default;
  background-color: ${props => {
    let backgroundColor = '#ccc';
    if (props.hover && !props.selected) {
      backgroundColor = '#B8B8B8';
    } else if (props.selected) {
      backgroundColor = 'darkgrey';
    }
    return backgroundColor;
  }};

  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  color: #222;
  margin-left: 1px;
  /* border-top: 1px solid  #222;
    border-right: 1px solid #222;
    border-left: 1px solid  #222; */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-right: 1px solid lightgray;
`;

export const TabPanel = styled.div`
  display: flex;
  flex-direction: row;
  background: #ccc;
  padding-top: 1px;
  overflow: auto;
  white-space: nowrap;
`;

export const Button = styled.div`
  font-size: 15px;
  opacity: ${props => {
    return props.hover || props.selected ? '1' : '0';
  }};
  border-radius: 50%;
  display: inline-block;
  padding: 5px;
  margin-left: 5px;
`;

export const Indicator = styled.div`
  width: 10px;
  height: 10px;
  display: inline-block;
  background-color: orange;
  border-radius: 50%;
  position: relative;
  top: -8px;
  left: 5px;
  border: grey solid 1px;
  opacity: ${props => {
    let opacity = 0;
    if (!props.selected && props.activity) {
      opacity = 1;
    }
    return opacity;
  }};
`;
