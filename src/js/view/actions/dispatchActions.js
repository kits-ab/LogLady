export const handleShowSettings = dispatch => {
  dispatch({
    type: 'showSettings'
  });
};

export const handleTailSwitch = (dispatch, data) => {
  dispatch({
    type: 'tailSwitch',
    data
  });
};

export const handleFilterInput = (dispatch, data) => {
  dispatch({
    type: 'filterInput',
    data: data
  });
};

export const handleHighlightInput = (dispatch, data) => {
  dispatch({
    type: 'highlightInput',
    data: data
  });
};

export const handleHighlightColor = (dispatch, data) => {
  dispatch({
    type: 'highlightColor',
    data: data
  });
};

export const handleWrapLineSetting = (dispatch, data) => {
  dispatch({
    type: 'wrapLineSetting',
    data
  });
};

export const handleCloseFile = dispatch => {
  // let functionsArray = [
  //   'menu_open',
  //   'liveLines',
  //   'nthLines',
  //   'numberOfLines',
  //   'fileSize'
  // ];
  // functionsArray.map(_function => {
  //   dispatch({
  //     type: _function,
  //     data:
  //       _function === 'menu_open'
  //         ? 'clearOpenFiles'
  //         : _function === 'liveLines'
  //         ? 'clearLines'
  //         : ''
  //   });
  // });
  dispatch({
    type: 'menu_open',
    data: 'clearOpenFiles'
  });
  dispatch({
    type: 'liveLines',
    data: 'clearLines'
  });
  dispatch({
    type: 'nthLines',
    data: ''
  });
  dispatch({
    type: 'numberOfLines',
    data: ''
  });
  dispatch({
    type: 'fileSize',
    data: ''
  });
};
