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
      const logs = { ...state.logs };
      logs[sourcePath] = [...log];

      return { ...state, logs: logs };
    }
    case 'LOGVIEWER_ADD_LINES':
      const { sourcePath, lines } = action.data;
      const newLogs = { ...state.logs };
      const log = state.logs[sourcePath];
      newLogs[sourcePath] = log ? [...log, ...lines] : [...lines];

      return { ...state, logs: newLogs };

    default:
      return state;
  }
};
