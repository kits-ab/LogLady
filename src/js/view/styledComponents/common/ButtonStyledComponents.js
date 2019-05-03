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

export const SwitchButtonContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 25px;

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
