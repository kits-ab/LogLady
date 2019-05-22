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

export const setLogSourceFile = (
  dispatch,
  filePath,
  numberOfLines,
  fileSize,
  history
) => {
  dispatch({
    type: 'setLogSource',
    filePath
  });

  dispatch({
    type: 'liveLines',
    filePath,
    lines: history
  });

  dispatch({
    type: 'numberOfLines',
    data: numberOfLines
  });

  dispatch({
    type: 'fileSize',
    data: fileSize
  });
};

export const clearSources = dispatch => {
  dispatch({
    type: 'clearAllLogs'
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

export const hideSnackBar = (dispatch, instant) => {
  dispatch({
    type: 'SNACKBAR_HIDE',
    data: {
      instant
    }
  });
};

export const showSnackBar = (dispatch, message, level, fadeAfter) => {
  dispatch({
    type: 'SNACKBAR_SHOW_NEW',
    data: {
      message,
      level,
      fadeAfter
    }
  });
};
