const initialState = { logs: {} };

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'clearAllLogs':
      return {
        ...state,
        logs: {}
      };
    case 'liveLines':
      const newLines = action.lines.split(/\r?\n/);
      const newLogs = { ...state.logs };
      const oldLog = state.logs[action.filePath];
      newLogs[action.filePath] = oldLog ? [...oldLog, ...newLines] : newLines;

      return { ...state, logs: newLogs };

    default:
      return state;
  }
};
