import styled from 'styled-components';
import Color from 'color';

export const LogViewerListContainer = styled.div`
  min-width: 100%;
  overflow: auto;
`;

export const LogLine = styled.div`
  background: ${props => {
    const color = '#444';
    return props.index & 1
      ? color
      : Color(color)
          .darken(0.3)
          .hex();
  }};
  ${props => {
    return props.fixedWidth ? 'width: ' + props.fixedWidth + 'px;' : '';
  }}

  ${props => {
    return props.fixedHeight ? 'height: ' + props.fixedHeight + 'px;' : '';
  }}
  ${props => {
    return props.wrap
      ? `
    word-wrap: break-word;
    word-break: break-all;`
      : 'white-space: nowrap;';
  }};
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
`;
