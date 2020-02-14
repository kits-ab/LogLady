import { logViewerReducer } from './logViewerReducer';

describe('logviewer reducer', () => {
  it('should return the initial state', () => {
    const initialState = { logs: {}, metaData: {} };
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
      metaData: {}
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
    // Size is zero to avoid ghost lines
    const size = 0;
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] }
    };
    const expectedState = {
      logs: { test: ['hej4', 'hej5'] }
    };
    const sourcePath = 'test';
    const action = {
      type: 'LOGVIEWER_SET_LOG',
      data: { sourcePath, log, size }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should append lines to source', () => {
    const lines = ['hej4', 'hej5'];
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3'] }
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3', 'hej4', 'hej5'] }
    };
    const sourcePath = 'test';
    const action = {
      type: 'LOGVIEWER_ADD_LINES',
      data: { sourcePath, lines }
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
