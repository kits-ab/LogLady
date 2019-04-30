import styled from 'styled-components';

export const Settings = styled.div`
  display: flex;
  flex-direction: row;
  width: 100vw;
  margin-top: 30px;
  position: fixed;
  color: #222;
  background: #ccc;
  justify-content: flex-start;
  z-index: 1;
`;

export const Setting = styled.div`
  justify-content: center;
  padding: 10px;
  p {
    margin: 10px 0 5px 40px;
  }
`;

export const CloseButton = styled.button`
  position: fixed;
  margin-top: 30px;
  margin-left: calc(100% - 47px);
  display: block;
  box-sizing: border-box;
  width: 27px;
  height: 27px;
  border-width: 2px;
  border-style: solid;
  border-color: #808080;
  border-radius: 100%;
  outline: none;
  background: -webkit-linear-gradient(
      -45deg,
      transparent 48%,
      transparent 46%,
      #808080 46%,
      #808080 56%,
      transparent 56%,
      transparent 100%
    ),
    -webkit-linear-gradient(45deg, transparent 48%, transparent 46%, #808080 46%, #808080
          56%, transparent 56%);
  background-color: ivory;
  box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0);
  transition: all 0.3s ease;
  z-index: 1;
`;
