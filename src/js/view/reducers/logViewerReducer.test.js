import { logViewerReducer } from './logViewerReducer';

describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = {
      logs: {},
      meanByteValuesOfInitialLines: {},
      meanByteValuesOfLines: {},
      startByteOfLines: {},
      nrOfLinesInViewer: null
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
      meanByteValuesOfInitialLines: {},
      meanByteValuesOfLines: {},
      startByteOfLines: {},
      nrOfLinesInViewer: null
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
      meanByteValuesOfInitialLines: { test: 4 },
      meanByteValuesOfLines: { test: 4 },
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
  it('should replace lines when overflowing viewer', () => {
    const lines = ['hej4', 'hej5'];
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      nrOfLinesInViewer: 3
    };
    const expectedState = {
      logs: { test: ['hej3', 'hej4', 'hej5'] },
      nrOfLinesInViewer: 3
    };
    const sourcePath = 'test';
    const followTail = true;
    const action = {
      type: 'LOGVIEWER_ADD_LINES',
      data: { sourcePath, lines, followTail }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should not replace lines when not following tail', () => {
    const lines = ['hej4', 'hej5'];
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] },
      nrOfLinesInViewer: 3
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3', 'hej4', 'hej5'] },
      nrOfLinesInViewer: 3
    };
    const sourcePath = 'test';
    const followTail = false;
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
      startByteOfLines: {},
      nrOfLinesInViewer: 2
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2'] },
      meanByteValuesOfLines: { test: 4 },
      startByteOfLines: { test: [1, 2] },
      nrOfLinesInViewer: 2
    };
    const action = {
      type: 'LOGVIEWER_ADD_LINES_FETCHED_FROM_BYTE_POSITION',
      data: { lines, sourcePath, startByteOfLines }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should update the current number of lines in the viewer', () => {
    const numberOfLinesToFillLogView = 10;
    const state = {
      logs: {},
      startByteOfLines: {},
      nrOfLinesInViewer: 5
    };
    const expectedState = {
      logs: {},
      startByteOfLines: {},
      nrOfLinesInViewer: 10
    };

    const action = {
      type: 'LOGVIEWER_UPDATE_CURRENT_NR_OF_LINES_IN_VIEWER',
      data: { numberOfLinesToFillLogView }
    };

    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
