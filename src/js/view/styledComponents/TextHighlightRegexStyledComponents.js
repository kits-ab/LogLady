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
  '#a4262c': '#222',
  '#ca5010': '#222',
  '#038387': '#222',
  '#8764b8': '#222',
  '#004e8c': '#222',
  default: '#222'
};

const backgroundColor = {
  '#a4262c': '#a4262c',
  '#ca5010': '#ca5010',
  '#038387': '#038387',
  '#8764b8': '#8764b8',
  '#004e8c': '#004e8c',
  default: '#a4262c'
};

export const HighlightText = styled.span`
  background: ${props => {
    const bgColor = backgroundColor[props.color];
    return bgColor ? bgColor : backgroundColor.default;
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
