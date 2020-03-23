import { logViewerReducer } from './logViewerReducer';

describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      logs: {},
      startByteOfLines: {},
      nrOfLinesOfOpenFiles: {}
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
      startByteOfLines: {},
      nrOfLinesOfOpenFiles: {}
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
    const log = ['hej4', 'hej5'];
    const startByteOfLines = [1, 2];
    // Size is zero to avoid ghost lines
    const size = 0;
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] }
    };
    const expectedState = {
      logs: { test: ['hej4', 'hej5'] },
      startByteOfLines: { test: [1, 2] }
    };
    const sourcePath = 'test';
    const action = {
      type: 'LOGVIEWER_SET_LOG',
      data: { sourcePath, log, size, startByteOfLines }
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

  it('should add lines and metadata from byte position to initial state', () => {
    const lines = ['hej1', 'hej2'];
    const sourcePath = 'test';
    const startByteOfLines = [1, 2];
    const state = {
      logs: {},
      startByteOfLines: {}
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2'] },
      startByteOfLines: { test: [1, 2] }
    };
    const action = {
      type: 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BYTE_POSITION',
      data: { lines, sourcePath, startByteOfLines }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should set the calculated number of lines of the open files', () => {
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      startByteOfLines: { test: [1, 2, 3] },
      nrOfLinesOfOpenFiles: {}
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      startByteOfLines: { test: [1, 2, 3] },
      nrOfLinesOfOpenFiles: { test: 10 }
    };
    const sourcePath = 'test';
    const nrOfLines = 10;
    const action = {
      type: 'ADD_CALCULATED_LINE_AMOUNT_FOR_FILE',
      data: { sourcePath, nrOfLines }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
