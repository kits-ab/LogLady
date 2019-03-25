import styled from 'styled-components';

// export const HighlightText = styled.p`
//   background: red;
// `;

export const HighlightText = styled.p`
  ${({ active }) => {
    return (
      active &&
      `
    background: red;
  `
    );
  }}
`;
