const initialState = {
  logs: {},
  lengthOfInitialLogLineArrays: {},
  lengthOfEmptyLines: {},
  totalNrOfLinesForFiles: {},
  currentScrollTops: {},
  indexesForNewLines: {}
};

// Invisible character U+2800 being used in line.replace. Making the viewer display empty lines.
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
      const { sourcePath, log } = action.data;
      const _log = replaceEmptyLinesWithHiddenChar(log);

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: _log
        },
        lengthOfInitialLogLineArrays: {
          ...state.lengthOfInitialLogLineArrays,
          [sourcePath]: log.length
        },
        indexesForNewLines: {
          ...state.indexesForNewLines,
          [sourcePath]: 0
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
      const totalNrOfLines = lineCount ? lineCount : 0;
      const emptyLinesLength =
        lineCount - state.logs[sourcePath].length < 0
          ? 0
          : lineCount - state.logs[sourcePath].length;

      return {
        ...state,
        totalNrOfLinesForFiles: {
          ...state.totalNrOfLinesForFiles,
          [sourcePath]: totalNrOfLines
        },
        lengthOfEmptyLines: {
          ...state.lengthOfEmptyLines,
          [sourcePath]: emptyLinesLength
        }
      };
    }

    case 'LOGVIEWER_ADD_LINES': {
      console.log('ADDING');
      const { sourcePath, lines } = action.data;
      const logLines = state.logs[sourcePath] ? state.logs[sourcePath] : [];
      const totalNrOfLines = state.totalNrOfLinesForFiles[sourcePath]
        ? state.totalNrOfLinesForFiles[sourcePath]
        : 0;
      const newTotalLinesLength = totalNrOfLines + lines.length;
      const _lines = replaceEmptyLinesWithHiddenChar(lines);

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...logLines, ..._lines]
        },
        totalNrOfLinesForFiles: {
          ...state.totalNrOfLinesForFiles,
          [sourcePath]: newTotalLinesLength
        }
      };
    }

    case 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BACKEND_CACHE': {
      console.log('UPDATE CACHE');
      const {
        sourcePath,
        newLines,
        indexForNewLines,
        isEndOfFile
      } = action.data;
      // If we have the end of the file in newLines, adjusting the index for where the new lines will be inserted
      // takes away possible empty lines at the end of the file.
      const newIndex = isEndOfFile
        ? state.totalNrOfLinesForFiles[sourcePath] - newLines.length
        : indexForNewLines;
      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: newLines
        },
        indexesForNewLines: {
          ...state.indexesForNewLines,
          [sourcePath]: newIndex
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
