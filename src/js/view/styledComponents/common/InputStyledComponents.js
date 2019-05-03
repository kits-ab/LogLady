import styled from 'styled-components';

export const TextFieldInputContainer = styled.input`
  height: 20px;
  background: #444;
  color: white;

  ::-webkit-input-placeholder {
    text-align: center;
    color: #333;
  }
  :focus {
    border: 0.5px solid white;
    outline: none;
  }

  padding: 5px 10px;
`;
