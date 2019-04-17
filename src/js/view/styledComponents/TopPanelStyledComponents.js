import styled from 'styled-components';

export const AppBar = styled.div`
  background-color: orange;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 1;

  top: 0;
  p {
    margin: 12px 28px 0 28px;
    color: green;
  }
`;

export const TextFieldInput = styled.input`
  width: 15%;
  margin: 10px 20px;
  height: 20px;
  background: linear-gradient(#e66465, #9198e5);
  color: lightgreen;

  ::-webkit-input-placeholder {
    color: yellow;
  }
`;

export const TailSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 25px;
  margin: 10px 20px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: red;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
  span:before {
    position: absolute;
    content: '';
    height: 22.8px;
    width: 22.8px;
    left: 1px;
    bottom: 1.3px;
    background-color: aquamarine;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: #2196f3;
  }
  input:checked + span:before {
    -webkit-transform: translateX(22.8px);
    -ms-transform: translateX(22.8px);
    transform: translateX(22.8px);
  }
`;

export const Tail = styled.div`
  margin-left: auto;

  span {
    color: blue;
  }
`;
