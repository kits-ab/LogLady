const initialState = { logs: {} };

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGVIEWER_REMOVE_LOG': {
      const { sourcePath } = action.data;
      const logsToKeep = {};

      // Find which logs to keep
      for (let [source, log] of Object.entries(state.logs)) {
        if (source !== sourcePath) {
          logsToKeep[source] = log;
        }
      }

      return { ...state, logs: { ...logsToKeep } };
    }
    case 'LOGVIEWER_CLEAR':
      return {
        ...state,
        logs: {}
      };
    case 'LOGVIEWER_SET_LOG': {
      console.log('SETTING');
      const { sourcePath, log } = action.data;
      return { ...state, logs: { ...state.logs, [sourcePath]: [...log] } };
    }
    case 'LOGVIEWER_ADD_LINES':
      console.log('ADDING');
      const { sourcePath, lines } = action.data;
      const log = state.logs[sourcePath];

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: log ? [...log, ...lines] : [...lines]
        }
      };

    default:
      return state;
  }
};
