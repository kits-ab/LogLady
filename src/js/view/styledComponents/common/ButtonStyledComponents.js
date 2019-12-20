import styled from 'styled-components';

export const OpenFileButton = styled.button`
  height: 27px;
  min-width: 100px;
  width: 100px;
  color: white;
  background: gray;
  border-radius: 4px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.8);
  outline: none;
`;

export const TextButton = styled.button`
  border: none;
  background-color: inherit;
  color: ${props => {
    return props.color ? props.color : '#222';
  }};
  padding: 14px 28px;
  font-size: 16px;
  cursor: pointer;
  display: inline-block;
  outline: none;

  :hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;
