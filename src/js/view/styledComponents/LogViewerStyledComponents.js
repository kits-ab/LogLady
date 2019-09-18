import styled from 'styled-components';

export const LogViewerContainer = styled.div`
  display: flex;
  flex: 1;
  border: 1px solid white;
  color: #ccc;
  background: #444;
  height: calc(100% - 32px);
  overflow-anchor: none;
  min-width: 0;
`;

export const CloseFileButton = styled.button`
  position: fixed;
  margin-top: 10px;
  margin-left: calc(100% - 52px);
  display: ${props => {
    return props.show ? 'block' : 'none';
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
  z-index: 1;

  &:hover {
    opacity: 1;
  }
`;
