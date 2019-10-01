/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { SnackBarContainer } from 'js/view/styledComponents/common/SnackBarStyledComponents';

const SnackBar = props => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    let timeout;

    setShow(props.show);
    setFadeOut(props.show);
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
    <SnackBarContainer
      fadeOut={fadeOut}
      color={props.color}
      className={show ? 'show' : 'hide'}
    >
      {props.children}
    </SnackBarContainer>
  );
};

export default SnackBar;
