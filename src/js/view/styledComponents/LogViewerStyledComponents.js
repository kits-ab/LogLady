import styled from 'styled-components';

export const TextContainer = styled.div`
  overflow: auto;
  height: calc(100vh - 93px);
  border: 1px solid white;
  background: #222;
  color: #ccc;
  width: calc(100vw - 12px);
  postition: fixed;
  margin: 55px 0 10px 5px;
  .log-line {
    white-space: nowrap;
  }
`;

setTimeout(() => {}, 5000);
export const CloseFileButton = styled.button`
  position: fixed;
  margin-top: 10px;
  margin-left: calc(100% - 52px);
  display: ${props => {
    return props.openFiles ? (props.openFiles[0] ? 'block' : 'none') : 'none';
  }};
  box-sizing: border-box;
  width: 27px;
  height: 27px;
  border-width: 2px;
  border-style: solid;
  border-color: #696969;
  border-radius: 100%;
  outline: none;
  background: -webkit-linear-gradient(
      -45deg,
      transparent 48%,
      transparent 46%,
      silver 46%,
      silver 56%,
      transparent 56%,
      transparent 100%
    ),
    -webkit-linear-gradient(45deg, transparent 48%, transparent 46%, silver 46%, silver
          56%, transparent 56%);
  background-color: white;
  opacity: 0.3;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0);
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;
