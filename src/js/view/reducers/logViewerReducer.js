const initialState = {
  logs: {},
  startByteOfLines: {},
  nrOfLinesOfOpenFiles: {}
};

export const logViewerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGVIEWER_REMOVE_LOG': {
      const { sourcePath } = action.data;
      const logsToKeep = {};

      Object.keys(state.logs).forEach(source => {
        let log = state.logs[source];
        if (source !== sourcePath) {
          logsToKeep[source] = log;
        }
      });

      return { ...state, logs: { ...logsToKeep } };
    }
    case 'LOGVIEWER_CLEAR':
      return {
        ...state,
        logs: {}
      };
    case 'LOGVIEWER_SET_LOG': {
      console.log('SETTING');
      const { sourcePath, log, startByteOfLines } = action.data;

      return {
        ...state,
        logs: { ...state.logs, [sourcePath]: log },
        startByteOfLines: {
          ...state.startByteOfLines,
          [sourcePath]: [...startByteOfLines]
        }
      };
    }
    case 'ADD_CALCULATED_LINE_AMOUNT_FOR_FILE': {
      console.log('ADDING LINE AMOUNT');
      const { sourcePath, nrOfLines } = action.data;
      return {
        ...state,
        nrOfLinesOfOpenFiles: {
          ...state.nrOfLinesOfOpenFiles,
          [sourcePath]: nrOfLines
        }
      };
    }
    case 'LOGVIEWER_ADD_LINES': {
      console.log('ADDING');
      const { sourcePath, lines } = action.data;
      const log = state.logs[sourcePath] ? state.logs[sourcePath] : [];

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...log, ...lines]
        }
      };
    }
    case 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BYTE_POSITION': {
      console.log('ADDING LINES FROM BYTE POS');
      const { lines, sourcePath, startByteOfLines } = action.data;

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...lines]
        },
        startByteOfLines: {
          ...state.startByteOfLines,
          [sourcePath]: [...startByteOfLines]
        }
      };
    }

    default:
      return state;
  }
};
