import { logViewerReducer } from './logViewerReducer';

describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      logs: {},
      nrOfLinesInFECache: {},
      totalNrOfLinesForFiles: {},
      lengthOfInitialLogLineArrays: {}
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
      lengthOfInitialLogLineArrays: {}
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
    const log = ['hej4', 'hej5'];
    const lineCount = 4;
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] }
    };
    const expectedState = {
      logs: { test: ['.', '.', 'hej4', 'hej5'] },
      lengthOfInitialLogLineArrays: { test: 2 },
      nrOfLinesInFECache: { test: 6 }
    };
    const action = {
      type: 'LOGVIEWER_SET_LOG',
      data: { sourcePath, log, lineCount }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
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

  // TODO: Update the tests to match the new reducer logic

  // it.only('should update the frontend cache with new lines from specified position', () => {
  //   const sourcePath = 'testPath';
  //   const newLines = [];
  //   const indexForInsertingNewLines = 0;
  //   const totalFECacheLength = 10;
  //   const state = {};
  //   const expectedState = {};
  //   const action = {
  //     type: 'LOGVIEWER_ADD_LINES',
  //     data: {
  //       sourcePath,
  //       newLines,
  //       indexForInsertingNewLines,
  //       totalFECacheLength
  //     }
  //   };
  //   expect(logViewerReducer(state, action)).toEqual(expectedState);
  // });
});
