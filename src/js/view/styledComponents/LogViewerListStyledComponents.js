import styled from 'styled-components';

export const LogViewerListContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
`;

export const LogLine = styled.div`
  min-width: 100%;
  background-color: #444;
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  :nth-child(odd) {
    background-color: #303030;
  }
  white-space: ${props => {
    return props.wrap ? 'normal' : 'nowrap';
  }};
`;

export const LogLineRuler = styled(LogLine)`
  visibility: hidden;
  min-width: unset;
  position: fixed;
  display: inline-block;
`;
