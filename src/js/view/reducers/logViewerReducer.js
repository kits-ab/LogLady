const initialState = { logs: {} };

const formatLines = lines => {
  return lines.split(/\r?\n/).filter(x => {
    return x;
  });
};

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
      newLogs[sourcePath] = formatLines(log);

      return { ...state, logs: newLogs };
    }
    case 'LOGVIEWER_ADD_LINES':
      const { sourcePath, lines } = action.data;
      const newLines = formatLines(lines);
      const newLogs = { ...state.logs };
      const oldLog = state.logs[sourcePath];
      newLogs[sourcePath] = oldLog ? [...oldLog, ...newLines] : newLines;

      return { ...state, logs: newLogs };

    default:
      return state;
  }
};
