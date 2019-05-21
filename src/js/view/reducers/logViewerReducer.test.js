import { logViewerReducer } from './logViewerReducer';

describe('logViewer reducers', () => {
  it('should return the initial state', () => {
    const initialState = { logs: {} };
    expect(logViewerReducer(undefined, {})).toEqual(initialState);
  });
  it('should reset lines', () => {
    const state = { logs: ['lalala', 'lililil'] };
    const expectedState = { logs: {} };
    const action = {
      type: 'clearAllLogs'
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should append lines to initial state', () => {
    const lines = 'hej1\nhej2\nhej3\n';
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3', ''] }
    };
    const filePath = 'test';

    const action = {
      type: 'liveLines',
      filePath,
      lines
    };
    expect(logViewerReducer(undefined, action)).toEqual(expectedState);
  });
  it('should append lines to populated state', () => {
    const lines = 'hej4\nhej5\n';
    const state = {
      logs: { test: ['hej1', 'hej2', 'hej3', ''] }
    };
    const expectedState = {
      logs: { test: ['hej1', 'hej2', 'hej3', '', 'hej4', 'hej5', ''] }
    };
    const filePath = 'test';
    const action = {
      type: 'liveLines',
      filePath,
      lines
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
