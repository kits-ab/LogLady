import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  flex-direction: ${props => {
    return props.column ? 'column' : 'row';
  }};
  flex: 1;

  align-items: ${props => {
    if (props['align-start']) return 'flex-start';
    if (props['align-end']) return 'flex-end';
    if (props['align-center']) return 'center';
    if (props['align-stretch']) return 'stretch';

    return 'baseline';
  }};
`;

const calculatePadding = level => {
  if (level <= 0) return 0;
  return 3 * Math.pow(2, level);
};

const findLevel = (props, prefix) => {
  let prop = Object.keys(props).find(x => {
    return x.startsWith(prefix);
  });
  if (!prop) return 0;

  return Number.parseInt(prop.slice(prefix.length));
};

export const Container = styled.div`
  display: flex;
  word-break: break-all;

  ${props => {
    let padding = [
      findLevel(props, 'pt-'),
      findLevel(props, 'pr-'),
      findLevel(props, 'pb-'),
      findLevel(props, 'pl-')
    ]
      .map((x, i) => {
        return (
          findLevel(props, 'pa-') ||
          (i & 1 && findLevel(props, 'px-')) ||
          (!(i & 1) && findLevel(props, 'py-')) ||
          x
        );
      })
      .map(x => {
        return calculatePadding(x);
      });

    return `padding: ${padding[0]}px ${padding[1]}px ${padding[2]}px ${
      padding[3]
    }px`;
  }};
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
