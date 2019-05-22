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
    type: 'MENU_SET_SOURCE',
    data: { filePath }
  });

  dispatch({
    type: 'LOGVIEWER_ADD_LINES',
    data: {
      filePath,
      lines: history
    }
  });

  dispatch({
    type: 'LOGINFO_SET_NUMBER_OF_LINES',
    data: numberOfLines
  });

  dispatch({
    type: 'LOGINFO_SET_FILESIZE',
    data: fileSize
  });
};

export const clearSources = dispatch => {
  dispatch({
    type: 'LOGVIEWER_CLEAR'
  });

  dispatch({
    type: 'MENU_CLEAR'
  });

  dispatch({
    type: 'LOGINFO_SET_NUMBER_OF_LINES',
    data: ''
  });
  dispatch({
    type: 'LOGINFO_SET_FILESIZE',
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
