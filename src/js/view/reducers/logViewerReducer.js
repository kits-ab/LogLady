const initialState = { logs: {} };

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGVIEWER_CLEAR':
      return {
        ...state,
        logs: {}
      };
    case 'LOGVIEWER_SET_LOG': {
      const { sourcePath, log } = action.data;
      const newLogs = { ...state.logs };
      newLogs[sourcePath] = log.split(/\r?\n/);

      return { ...state, logs: newLogs };
    }
    case 'LOGVIEWER_ADD_LINES':
      const { sourcePath, lines } = action.data;
      const newLines = lines.split(/\r?\n/);
      const newLogs = { ...state.logs };
      const oldLog = state.logs[sourcePath];
      newLogs[sourcePath] = oldLog ? [...oldLog, ...newLines] : newLines;

      return { ...state, logs: newLogs };

    default:
      return state;
  }
};
