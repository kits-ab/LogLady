import styled from 'styled-components';

export const Indicator = styled.svg`
  -webkit-animation: action 0.6s infinite alternate;
  animation: action 0.6s infinite alternate;
  margin: -10px 0 0 -10px;
  width: 20px;
  height: 20x;
  display: inline-block;
  position: relative;
  top: 2px;
  left: 14px;
  @-webkit-keyframes action {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-5px);
    }
  }
  @keyframes action {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-3px);
    }
  }
  opacity: ${props => {
    let opacity = 0;
    if (!props.selected && props.activity) {
      opacity = 1;
    }
    return opacity;
  }};
`;
