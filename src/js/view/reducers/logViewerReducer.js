const initialState = {
  logs: {},
  startByteOfLines: {},
  nrOfLinesInViewer: null,
  meanByteValuesOfInitialLines: {},
  meanByteValuesOfLines: {},
  scrollPosition: null,
  scrollPositions: {}
};

const calculateMeanValueOfBytesPerLine = startBytes => {
  return Math.round(
    (startBytes[startBytes.length - 1] - startBytes[0]) / startBytes.length
  );
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
      let meanByteValueOfInitialLines = calculateMeanValueOfBytesPerLine(
        startByteOfLines
      );
      return {
        ...state,
        logs: { ...state.logs, [sourcePath]: log },
        startByteOfLines: {
          ...state.startByteOfLines,
          [sourcePath]: [...startByteOfLines]
        },
        meanByteValuesOfInitialLines: {
          ...state.meanByteValuesOfInitialLines,
          [sourcePath]: meanByteValueOfInitialLines
        },
        meanByteValuesOfLines: {
          ...state.meanByteValuesOfLines,
          [sourcePath]: meanByteValueOfInitialLines
        }
      };
    }
    case 'LOGVIEWER_ADD_LINES': {
      console.log('ADDING');
      const { sourcePath, lines, followTail } = action.data;
      const log = state.logs[sourcePath] ? state.logs[sourcePath] : [];
      const newLength = log.length + lines.length;

      let newLines = [];
      if (followTail) {
        // If we are following tail and have not filled the screen,
        // append new lines to logs. If the screen is filled, removes
        // lines from the beginning of the logs and add to the
        // end of them.
        newLines =
          newLength > state.nrOfLinesInViewer
            ? log.slice(lines.length).concat(lines)
            : log.concat(lines);
      } else {
        // If we are not following tail, but have not filled the screen
        // we are at the bottom of the file and should update the logs
        newLines =
          log.length <= state.nrOfLinesInViewer ? log.concat(lines) : log;
      }

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...newLines]
        }
      };
    }
    case 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BYTE_POSITION': {
      console.log('ADDING FROM BYTE POS');
      const { lines, sourcePath, startByteOfLines } = action.data;
      let meanByteValueOfLines = calculateMeanValueOfBytesPerLine(
        startByteOfLines
      );

      return {
        ...state,
        logs: {
          ...state.logs,
          [sourcePath]: [...lines]
        },
        startByteOfLines: {
          ...state.startByteOfLines,
          [sourcePath]: [...startByteOfLines]
        },
        meanByteValuesOfLines: {
          ...state.meanByteValuesOfLines,
          [sourcePath]: meanByteValueOfLines
        }
      };
    }
    case 'LOGVIEWER_UPDATE_CURRENT_NR_OF_LINES_IN_VIEWER': {
      const { numberOfLinesToFillLogView } = action.data;

      return {
        ...state,
        nrOfLinesInViewer: numberOfLinesToFillLogView
      };
    }

    case 'LOGVIEWER_UPDATE_SCROLL_POSITION': {
      const { sourcePath, scrollPosition } = action.data;

      return {
        ...state,
        scrollPositions: {
          ...state.scrollPositions,
          [sourcePath]: scrollPosition
        }
      };
    }

    default:
      return state;
  }
};
