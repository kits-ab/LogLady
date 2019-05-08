export const handleShowSettings = dispatch => {
  dispatch({
    type: 'showSettings'
  });
};

export const handleTailSwitch = dispatch => {
  dispatch({
    type: 'tailSwitch'
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

export const handleWrapLineOn = dispatch => {
  dispatch({
    type: 'wrapLineOn'
  });
};

export const handleCloseFile = dispatch => {
  dispatch({
    type: 'menu_open',
    data: 'clearOpenFiles'
  });
  dispatch({
    type: 'clearLines',
    data: ''
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
