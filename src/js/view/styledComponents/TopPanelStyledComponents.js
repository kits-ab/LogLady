import styled from 'styled-components';

export const TopPanel = styled.div`
  background-color: darkgrey;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 2;
  align-items: center;

  top: 0;
  p {
    margin: 0 28px 0 28px;
    color: white;
  }
`;

export const TextFieldInput = styled.input`
  width: 15%;
  margin: 10px 20px;
  height: 20px;
  background: #444;
  color: white;

  ::-webkit-input-placeholder {
    color: #ccc;
  }
  :focus {
    border: 0.5px solid white;
    outline: none;
  }
`;

export const TailSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 25px;
  margin: 0 20px;

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
    background-color: #222;
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
    bottom: 0.5px;
    background-color: #808080;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + span {
    background-color: ivory;
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
    color: white;
  }
`;
