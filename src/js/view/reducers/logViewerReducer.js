import { updateLogViewerCache } from '../components/helpers/cacheHelper';

const initialState = {
  logs: {},
  nrOfLinesInFECache: {},
  lengthOfInitialLogLineArrays: {},
  lengthOfEmptyLines: {},
  totalNrOfLinesForFiles: {},
  currentScrollTops: {}
};

// Invisible character U+2800 being used in line.replace
const replaceEmptyLinesWithHiddenChar = arr => {
  const regexList = [/^\s*$/];
  return arr.map(line => {
    const isMatch = regexList.some(rx => {
      return rx.test(line);
    });
    return isMatch ? line.replace(regexList[0], '⠀') : line;
  });
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
      const { sourcePath, log /*, lineCount*/ } = action.data;
      const _log = replaceEmptyLinesWithHiddenChar(log);

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: _log /*[..._log, ...emptyLines] }*/
        },
        lengthOfInitialLogLineArrays: {
          ...state.lengthOfInitialLogLineArrays,
          [sourcePath]: log.length
        },
        currentScrollTops: {
          ...state.currentScrollTops,
          [sourcePath]: 0
        }
      };
    }

    case 'LOGVIEWER_ADD_LINE_COUNT_FOR_FILE': {
      console.log('ADDING LINE COUNT');
      const { sourcePath, lineCount } = action.data;
      console.log({ lineCount }, state.logs[sourcePath].length);
      const totalNrOfLines = lineCount ? lineCount : 0;
      const emptyLinesLength =
        lineCount - state.logs[sourcePath].length < 0
          ? 0
          : lineCount - state.logs[sourcePath].length;
      const totalLineAmountInCache =
        emptyLinesLength + state.logs[sourcePath].length;

      // Adding empty lines to initial cache
      const cache = updateLogViewerCache(totalLineAmountInCache).insertRows(
        0,
        state.logs[sourcePath]
      );

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: cache
        },
        totalNrOfLinesForFiles: {
          ...state.totalNrOfLinesForFiles,
          [sourcePath]: totalNrOfLines
        },
        lengthOfEmptyLines: {
          ...state.lengthOfEmptyLines,
          [sourcePath]: emptyLinesLength
        },
        nrOfLinesInFECache: {
          ...state.nrOfLinesInFECache,
          [sourcePath]: totalLineAmountInCache
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
            replaceEmptyLinesWithHiddenChar(newLines)
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

    case 'LOGVIEWER_SAVE_CURRENT_SCROLLTOP': {
      const { sourcePath, scrollTop } = action.data;

      return {
        ...state,
        currentScrollTops: {
          ...state.currentScrollTops,
          [sourcePath]: scrollTop
        }
      };
    }

    default:
      return state;
  }
};
