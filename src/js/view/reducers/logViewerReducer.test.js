import { logViewerReducer } from './logViewerReducer';

describe('logViewer reducers', () => {
  it('should return the initial state', () => {
    const initialState = { liveLines: [] };
    const action = {
      type: undefined
    };
    expect(logViewerReducer(undefined, action)).toEqual(initialState);
  });
  it('should reset lines', () => {
    const state = { liveLines: ['lalala', 'lililil'] };
    const expectedState = { liveLines: [] };
    const action = {
      type: 'clearLines'
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should append lines to initial state', () => {
    const lines = 'hej1\nhej2\nhej3\n';
    const expectedState = {
      liveLines: ['hej1', 'hej2', 'hej3', '']
    };
    const action = {
      type: 'liveLines',
      data: lines
    };
    expect(logViewerReducer(undefined, action)).toEqual(expectedState);
  });
  it('should append lines to populated state', () => {
    const lines = 'hej4\nhej5\n';
    const state = {
      liveLines: ['hej1', 'hej2', 'hej3', '']
    };
    const expectedState = {
      liveLines: ['hej1', 'hej2', 'hej3', '', 'hej4', 'hej5', '']
    };
    const action = {
      type: 'liveLines',
      data: lines
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
});
