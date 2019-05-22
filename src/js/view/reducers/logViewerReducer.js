const initialState = { logs: {} };

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGVIEWER_CLEAR':
      return {
        ...state,
        logs: {}
      };
    case 'LOGVIEWER_ADD_LINES':
      const { filePath, lines } = action.data;
      const newLines = lines.split(/\r?\n/);
      const newLogs = { ...state.logs };
      const oldLog = state.logs[filePath];
      newLogs[filePath] = oldLog ? [...oldLog, ...newLines] : newLines;

      return { ...state, logs: newLogs };

    default:
      return state;
  }
};

const getLog = (state, name) => {
  return state.logs[name];
};
