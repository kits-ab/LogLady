import styled from 'styled-components';

export const Settings = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  margin-top: 30px;
  position: fixed;
  color: #222;
  background: #ccc;
  justify-content: space-between;
  z-index: 1;
`;

const matchingTextColor = {
  '#b80000': '#eeefea',
  '#db3e00': '#eeefea',
  '#008b02': '#eeefea',
  '#006b76': '#eeefea',
  '#1273de': '#eeefea',
  '#004dcf': '#eeefea',
  '#5300eb': '#eeefea',
  default: '#222'
};

export const HighlightText = styled.span`
  background: ${props => {
    return props.color;
  }};
  color: ${props => {
    const textColor = matchingTextColor[props.color];
    return textColor ? textColor : matchingTextColor.default;
  }};
`;

export const HighlightMatch = styled.span`
  background: yellow;
  opacity: 0.5;
  color: black;
  font-weight: bold;
`;
