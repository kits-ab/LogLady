import styled from 'styled-components';

export const Input = styled.input`
  border: 0px;
  background: #999;
  :hover {
    background: #aaa;
  }
  color: white;
  padding: 10px 20px;
`;

export const Button = styled.button`
  border: 0px;
  background: ${props => (props.live ? 'red' : '#999')};
  color: white;
  padding: 10px 20px;
  margin-right: 10px;
`;
