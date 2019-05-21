import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-direction: ${props => {
    return props.column ? 'column' : 'row';
  }};
  flex: 1;

  align-items ${props => {
    if (props.alignStart) return 'flex-start';
    if (props.alignEnd) return 'flex-end';
    if (props.alignCenter) return 'center';
    if (props.alignStretch) return 'stretch';

    return 'baseline';
  }};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: ${props => {
    return props.column ? 'column' : 'row';
  }};
  flex-grow: ${props => {
    return props.grow ? '1' : '0';
  }};
  flex-shrink: ${props => {
    return props.shrink ? '1' : '0';
  }};
`;
