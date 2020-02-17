const initialState = { logs: {}, metaData: {} };

const createGhostLines = fileSize => {
  const amountOfGhostLines =
    fileSize / 150 < 10000 ? Math.round(fileSize / 150) : 10000;
  // Set ghostline to invisible unicode character (U+2800) to ensure that they are rendered
  return Array(amountOfGhostLines).fill('⠀');
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
      const { sourcePath, log, metaData } = action.data;
      console.log(metaData);
      return {
        ...state,
        logs: { ...state.logs, [sourcePath]: [...log] },
        metaData: { ...state.metaData, [sourcePath]: [...metaData] }
      };
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
    case 'LOGVIEWER_ADD_LINES_FROM_BYTE_POSITION': {
      const { lines, sourcePath, metaData } = action.data;

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...lines]
        },
        metaData: {
          ...state.metaData,
          [sourcePath]: [...metaData]
        }
      };
    }

    default:
      return state;
  }
};
