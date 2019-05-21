import React, { useState, useEffect } from 'react';
import { SnackBarContainer } from 'js/view/styledComponents/common/SnackBarStyledComponents';

export default function SnackBar(props) {
  const [show, setShow] = useState(false);

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
    <SnackBarContainer
      fadeOut={props.fadeAfter > 0}
      color={props.color}
      className={show ? 'show' : 'hide'}
    >
      {props.children}
    </SnackBarContainer>
  );
}
