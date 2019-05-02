import styled from 'styled-components';
import Color from 'color';

export const LogViewContainer = styled.div`
  overflow: auto;
  flex: 1;
  border: 1px solid white;
  color: #ccc;
  background: #444;
  min-width: 0;
`;

export const Log = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  display: inline-block;

  div:nth-child(even) {
    background: #444;
  }

  div:nth-child(odd) {
    background: ${Color('#444')
      .darken(0.3)
      .hex()};
  }
`;

export const LogLine = styled.div`
  min-width: 0;
  display: inline-block;
  width: 100%;
  ${props => {
    return props.wrap
      ? `
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;`
      : 'white-space: nowrap;';
  }}
`;

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
