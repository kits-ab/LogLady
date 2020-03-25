export const handleShowSettings = (dispatch, data) => {
  dispatch({
    type: 'showSettings',
    data: data
  });
};

export const handleTailSwitch = (dispatch, data) => {
  dispatch({
    type: 'tailSwitch',
    data: data
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

export const handleWrapLineOn = (dispatch, data) => {
  dispatch({
    type: 'wrapLineOn',
    data: data
  });
};

export const setSource = (dispatch, sourcePath) => {
  dispatch({
    type: 'MENU_SET_SOURCE',
    data: { sourcePath }
  });
};

export const updateSourceHandle = (dispatch, newSourceHandle) => {
  dispatch({
    type: 'UPDATE_CURRENT_SOURCE_HANDLE',
    data: { newSourceHandle }
  });
};

export const setLastSeenLogSizeToSize = (dispatch, path, fileSize) => {
  dispatch({
    type: 'LOGINFO_SET_LAST_SEEN_SIZE_TO_SIZE',
    data: {
      sourcePath: path,
      size: fileSize
    }
  });
};

export const updateLastSeenLogSizes = (dispatch, path, fileSize) => {
  dispatch({
    type: 'UPDATE_LAST_SEEN_LOG_SIZE',
    data: {
      sourcePath: path,
      size: fileSize
    }
  });
};

export const setFileData = (
  dispatch,
  filePath,
  fileSize,
  history,
  startByteOfLines
) => {
  dispatch({
    type: 'LOGVIEWER_SET_LOG',
    data: {
      sourcePath: filePath,
      log: history,
      size: fileSize,
      startByteOfLines
    }
  });

  dispatch({
    type: 'LOGINFO_SET_SIZE',
    data: {
      sourcePath: filePath,
      size: fileSize
    }
  });

  dispatch({
    type: 'CREATE_SETTINGS_OBJECT',
    data: {
      sourcePath: filePath
    }
  });
};

export const clearLog = (dispatch, filePath) => {
  dispatch({
    type: 'LOGVIEWER_REMOVE_LOG',
    data: {
      sourcePath: filePath
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
    type: 'LOGINFO_SET_SIZE',
    data: ''
  });
};

export const clearSource = (dispatch, filePath) => {
  dispatch({
    type: 'LOGVIEWER_REMOVE_LOG',
    data: {
      sourcePath: filePath
    }
  });

  dispatch({
    type: 'MENU_CLEAR_ITEM',
    data: {
      sourcePath: filePath
    }
  });

  dispatch({
    type: 'LOGINFO_REMOVE_LOG',
    data: {
      sourcePath: filePath
    }
  });
};

export const hideSnackBar = dispatch => {
  dispatch({
    type: 'SNACKBAR_HIDE'
  });
};

export const addNewLines = (dispatch, sourcePath, lines, followTail) => {
  dispatch({
    type: 'LOGVIEWER_ADD_LINES',
    data: {
      sourcePath,
      lines,
      followTail
    }
  });
};

export const increaseSize = (dispatch, sourcePath, size) => {
  dispatch({
    type: 'LOGINFO_INCREASE_SIZE',
    data: {
      sourcePath,
      size
    }
  });
};

export const showSnackBar = (dispatch, message, level) => {
  dispatch({
    type: 'SNACKBAR_SHOW_NEW',
    data: {
      message,
      level
    }
  });
};

export const addLinesFetchedFromBytePosition = (
  dispatch,
  startByteOfLines,
  lines,
  linesStartAt,
  linesEndAt,
  sourcePath
) => {
  dispatch({
    type: 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BYTE_POSITION',
    data: {
      lines,
      linesStartAt,
      linesEndAt,
      sourcePath,
      startByteOfLines
    }
  });
};

export const addCalculatedAmountOfLines = (dispatch, sourcePath, nrOfLines) => {
  dispatch({
    type: 'ADD_CALCULATED_LINE_AMOUNT_FOR_FILE',
    data: {
      sourcePath,
      nrOfLines
    }
  });
};

export const setInitialCache = (dispatch, sourcePath, emptyLines) => {
  dispatch({
    type: 'LOGVIEWER_SET_CACHE',
    data: {
      sourcePath,
      emptyLines
    }
  });
};

export const setTailSwitch = (dispatch, data) => {
  dispatch({
    type: 'LOGVIEWER_SET_TAILSWITCH',
    data: data
  });
};
