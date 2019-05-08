import { logViewerReducer } from './logViewerReducer';

describe('logViewer reducers', () => {
  it('should return the initial state', () => {
    const initialState = { liveLines: [], nthLines: '' };
    const action = {
      type: undefined
    };
    expect(logViewerReducer(undefined, action)).toEqual(initialState);
  });
  it('should reset lines', () => {
    const state = { liveLines: ['lalala', 'lililil'], nthLines: 'nice' };
    const expectedState = { liveLines: [], nthLines: 'nice' };
    const action = {
      type: 'clearLines'
    };
    expect(logViewerReducer(state, action)).toEqual(expectedState);
  });
  it('should append lines to initial state', () => {
    const lines = 'hej1\nhej2\nhej3\n';
    const expectedState = {
      liveLines: ['hej1', 'hej2', 'hej3', ''],
      nthLines: ''
    };
    const action = {
      type: 'liveLines',
      data: lines
    };
    expect(logViewerReducer(undefined, action)).toEqual(expectedState);
  });
  it('should append lines to populated state', () => {});
  //   it('should set nth lines', () => {});
});
