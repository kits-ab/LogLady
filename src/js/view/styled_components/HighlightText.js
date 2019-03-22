import styled from 'styled-components';

export const HighlightText = styled.span`
  ${({ active }) => {
    return (
      active &&
      `
        background: red;
    `
    );
  }}
`;
