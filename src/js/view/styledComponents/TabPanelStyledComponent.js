import styled from 'styled-components';

export const Indicator = styled.div`
  display: inline-block;
  position: relative;
  top: -1px;
  left: 8px;
  opacity: ${props => {
    let opacity = 0;
    if (!props.selected && props.activity) {
      opacity = 1;
    }
    return opacity;
  }};
`;
