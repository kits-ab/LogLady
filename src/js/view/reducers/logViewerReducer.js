import { updateLogViewerCache } from '../components/helpers/cacheHelper';

const initialState = {
  logs: {},
  nrOfLinesInFECache: {},
  lengthOfInitialLogLineArrays: {},
  lengthOfEmptyLines: {},
  totalNrOfLinesForFiles: {}
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
      console.log('SETTING LOG');
      const { sourcePath, log, lineCount } = action.data;
      const emptyLinesLength = lineCount - log.length;
      const emptyLines =
        lineCount > 0
          ? new Array(emptyLinesLength).fill('.', 0, emptyLinesLength)
          : [];
      const totalLineAmountInCache = lineCount + log.length;
      return {
        ...state,
        logs: { ...state.logs, [sourcePath]: [...emptyLines, ...log] },
        nrOfLinesInFECache: {
          ...state.nrOfLinesInFECache,
          [sourcePath]: totalLineAmountInCache
        },
        lengthOfInitialLogLineArrays: {
          ...state.lengthOfInitialLogLineArrays,
          [sourcePath]: log.length
        },
        lengthOfEmptyLines: {
          ...state.lengthOfEmptyLines,
          [sourcePath]: emptyLinesLength
        }
      };
    }

    case 'LOGVIEWER_ADD_LINE_COUNT_FOR_FILE': {
      console.log('ADDING LINE COUNT');
      const { sourcePath, lineCount } = action.data;
      const totalNrOfLines = lineCount ? lineCount : 0;
      return {
        ...state,
        totalNrOfLinesForFiles: {
          ...state.totalNrOfLinesForFiles,
          [sourcePath]: totalNrOfLines
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

    case 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BACKEND_CACHE': {
      console.log('UPDATE CACHE');
      const { sourcePath, newLines, indexForNewLines } = action.data;
      const cacheLength = state.nrOfLinesInFECache[sourcePath];
      const updatedCache = newLines
        ? updateLogViewerCache(cacheLength).insertRows(
            indexForNewLines,
            newLines
          )
        : state.logs[sourcePath];
      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: updatedCache
        }
      };
    }

    default:
      return state;
  }
};
