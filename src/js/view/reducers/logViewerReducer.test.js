import { logViewerReducer } from './logViewerReducer';
describe('', () => {
  it('', () => {});
});
describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      logs: {},
      totalNrOfLinesForFiles: {},
      lengthOfInitialLogLineArrays: {},
      lengthOfEmptyLines: {},
      currentScrollTops: {},
      indexesForNewLines: {}
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
      totalNrOfLinesForFiles: {},
      lengthOfInitialLogLineArrays: {},
      lengthOfEmptyLines: {},
      currentScrollTops: {},
      indexesForNewLines: {}
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
      logs: { test: ['hej1', 'hej2'] },
      lengthOfInitialLogLineArrays: { test: 2 },
      lengthOfEmptyLines: {},
      totalNrOfLinesForFiles: {},
      currentScrollTops: { test: 0 },
      indexesForNewLines: { test: 0 }
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
});
