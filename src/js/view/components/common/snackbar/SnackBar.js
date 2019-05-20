import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

export default function SnackBar(props) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useEffect(() => {
    let timeout;

    setShow(props.show);
    if (props.fadeAfter > 0 && props.show) {
      timeout = setTimeout(() => {
        setShow(false);
      }, props.fadeAfter);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [props.show]);

  return (
    <SnackbarContainer
      ref={ref}
      fade={props.fadeAfter > 0}
      color={props.color}
      className={show ? 'show' : 'hide'}
    >
      {props.children}
    </SnackbarContainer>
  );
}

const SnackbarContainer = styled.div`
  position: absolute;
  min-width: 50%;
  visibility: hidden;
  background-color: ${props => {
    return props.color ? props.color : '#333';
  }};
  color: #ccc;
  bottom: 20px;
  left: 10px;
  padding: 10px 16px;
  border-radius: 4px;
  z-index: 8;

  &.show {
    visibility: visible;
    -webkit-animation: fadein 0.5s;
    animation: fadein 0.5s;
  }

  &.hide {
    ${props => {
      return props.fade
        ? `
    -webkit-animation: fadeout 1.5s;
    animation: fadeout 1.5s;
    `
        : '';
    }}
  }

  @-webkit-keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 20px;
      opacity: 1;
    }
  }

  @keyframes fadein {
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 20px;
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeout {
    from {
      bottom: 20px;
      opacity: 1;
      visibility: visible;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
  }

  @keyframes fadeout {
    from {
      bottom: 20px;
      opacity: 1;
      visibility: visible;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
  }
`;
