import styled from 'styled-components';

export const Indicator = styled.div`
  width: 10px;
  height: 10px;
  display: inline-block;
  background-color: orange;
  border-radius: 50%;
  position: relative;
  top: -3px;
  left: 2px;
  border: grey solid 1px;
  opacity: ${props => {
    let opacity = 0;
    if (!props.selected && props.activity) {
      opacity = 1;
    }
    return opacity;
  }};
`;
