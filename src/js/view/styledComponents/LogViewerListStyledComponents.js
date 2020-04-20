import styled from 'styled-components';

export const LogViewerListContainer = styled.div`
  min-width: 100%;
  height: 100%;
  display: inline-block;
`;

export const LogLine = styled.div`
  min-width: 100%;
  color: ${props => {
    return props.emptyline ? (props.index % 2 === 0 ? '#444' : '#303030') : '';
  }};
  background-color: ${props => {
    return props.index % 2 === 0 ? '#444' : '#303030';
  }};
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  white-space: ${props => {
    return props.wrap ? 'normal' : 'nowrap';
  }};
`;
