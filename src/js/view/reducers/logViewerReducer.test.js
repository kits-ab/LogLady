import { logViewerReducer } from './logViewerReducer';

describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      logs: {},
      nrOfLinesInFECache: {},
      totalNrOfLinesForFiles: {},
      lengthOfInitialLogLineArrays: {},
      lengthOfEmptyLines: {}
    };
    expect(logViewerReducer(undefined, {})).toEqual(initialState);
  });

  it('should reset all logs', () => {
    const state = { logs: ['lalala', 'lililil'] };
    const expectedState = { logs: {} };
    const action = {
      type: 'LOGVIEWER_CLEAR'
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });

  it('should append lines to initial state', () => {
    const lines = ['hej1', 'hej2', 'hej3'];
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      nrOfLinesInFECache: {},
      totalNrOfLinesForFiles: {},
      lengthOfInitialLogLineArrays: {},
      lengthOfEmptyLines: {}
    };
    const sourcePath = 'test';

    const action = {
      type: 'LOGVIEWER_ADD_LINES',
      data: {
        sourcePath,
        lines
      }
    };
    expect(logViewerReducer(undefined, action)).toEqual(expectedState);
  });

  it('should set log on source', () => {
    const sourcePath = 'test';
    const log = ['hej1', 'hej2'];
    const lineCount = 4;

    const expectedState = {
      logs: { test: ['hej1', 'hej2', '.', '.'] },
      lengthOfInitialLogLineArrays: { test: 2 },
      nrOfLinesInFECache: { test: 4 },
      lengthOfEmptyLines: { test: 2 },
      totalNrOfLinesForFiles: {}
    };
    const action = {
      type: 'LOGVIEWER_SET_LOG',
      data: { sourcePath, log, lineCount }
    };
    expect(logViewerReducer(undefined, action)).toEqual(expectedState);
  });

  it('should append lines to source', () => {
    const lines = ['hej4', 'hej5'];
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      nrOfLinesInViewer: 5
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3', 'hej4', 'hej5'] },
      nrOfLinesInViewer: 5
    };
    const sourcePath = 'test';
    const followTail = true;
    const action = {
      type: 'LOGVIEWER_ADD_LINES',
      data: { sourcePath, lines, followTail }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });

  it('should update the frontend cache with new lines at the end of the log array', () => {
    const sourcePath = 'testPath';
    const newLines = ['c', 'd', 'e'];
    const indexForNewLines = 5;
    const state = {
      logs: {
        testPath: ['a', 'b', 'c', '.', '.', '.', '.', '.']
      },
      nrOfLinesInFECache: {
        testPath: 8
      }
    };
    const expectedState = {
      logs: {
        testPath: ['.', '.', '.', '.', '.', 'c', 'd', 'e']
      },
      nrOfLinesInFECache: {
        testPath: 8
      }
    };
    const action = {
      type: 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BACKEND_CACHE',
      data: {
        sourcePath,
        newLines,
        indexForNewLines
      }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });

  it('should update the frontend cache with new lines at the beginning of the log array', () => {
    const sourcePath = 'testPath';
    const newLines = ['a', 'b', 'c'];
    const indexForNewLines = 0;
    const state = {
      logs: {
        testPath: ['.', '.', '.', '.', '.', 'c', 'd', 'e']
      },
      nrOfLinesInFECache: {
        testPath: 8
      }
    };
    const expectedState = {
      logs: {
        testPath: ['a', 'b', 'c', '.', '.', '.', '.', '.']
      },
      nrOfLinesInFECache: {
        testPath: 8
      }
    };
    const action = {
      type: 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BACKEND_CACHE',
      data: {
        sourcePath,
        newLines,
        indexForNewLines
      }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
