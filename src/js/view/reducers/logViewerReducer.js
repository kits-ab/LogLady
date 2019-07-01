const initialState = { logs: {} };

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
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
