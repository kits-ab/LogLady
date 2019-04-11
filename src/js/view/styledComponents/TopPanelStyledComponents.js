import styled from 'styled-components';

export const AppBar = styled.div`
  background-color: #ddd;
  width: 100%;
  display: flex;
  flex-direction: row;
  top: 0;

  p {
    margin: 12px 28px 0 28px;
    color: #222;
  }
`;

export const TextFieldInput = styled.input`
  width: 15%;
  margin: 10px 20px;
  height: 30px;
`;

export const TailSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 27.2px;
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
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
  span:before {
    position: absolute;
    content: '';
    height: 20.8px;
    width: 20.8px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: #2196f3;
  }
  input:checked + span:before {
    -webkit-transform: translateX(20.8px);
    -ms-transform: translateX(20.8px);
    transform: translateX(20.8px);
  }
`;

export const Tail = styled.div`
  margin-left: auto;
  margin-right: 1.5%;

  span {
    color: #222;
  }
`;
