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

export const setSource = (dispatch, sourcePath) => {
  dispatch({
    type: 'MENU_SET_SOURCE',
    data: { sourcePath: sourcePath }
  });
};

export const setFileData = (dispatch, filePath, fileSize, history) => {
  dispatch({
    type: 'LOGVIEWER_SET_LOG',
    data: {
      sourcePath: filePath,
      log: history
    }
  });

  dispatch({
    type: 'LOGINFO_SET_FILESIZE',
    data: {
      filePath,
      fileSize
    }
  });
};

export const clearAllLogs = dispatch => {
  dispatch({
    type: 'LOGVIEWER_CLEAR'
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

export const addNewLines = (dispatch, sourcePath, lines) => {
  dispatch({
    type: 'LOGVIEWER_ADD_LINES',
    data: {
      sourcePath,
      lines
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
