import styled from 'styled-components';
import Color from 'color';

export const LogViewerListContainer = styled.div`
  min-width: 100%;
  overflow-y: auto;
  overflow-x: ${props => {
    return props.wrap ? 'hidden' : 'auto';
  }};
`;

export const LogLine = styled.div`
  min-width: 100%;
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

export const LogLineRuler = styled(LogLine)`
  visibility: hidden;
  min-width: 0px;
  position: absolute;
  display: inline-block;
`;
