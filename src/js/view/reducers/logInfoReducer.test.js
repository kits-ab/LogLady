import { logInfoReducer } from './logInfoReducer';

describe('log info reducer', () => {
  const initialState = { numberOfLines: 0, logSizes: {} };

  it('should return the initial state', () => {
    expect(logInfoReducer(undefined, {})).toEqual(initialState);
  });

  it('should set size of source path', () => {
    const sourcePath = 'folder/file';
    const size = 1000;
    const state = { ...initialState };
    const expectedState = { ...initialState, logSizes: { [sourcePath]: size } };
    const action = {
      type: 'LOGINFO_SET_SIZE',
      data: { sourcePath, size }
    };
    expect(logInfoReducer(state, action)).toEqual(expectedState);
  });

  it('should add size to size of source path', () => {
    const sourcePath = 'folder/file';
    const size = 33;
    const state = { ...initialState, logSizes: { [sourcePath]: 1000 } };
    const expectedState = { ...initialState, logSizes: { [sourcePath]: 1033 } };
    const action = {
      type: 'LOGINFO_INCREASE_SIZE',
      data: { sourcePath, size }
    };
    expect(logInfoReducer(state, action)).toEqual(expectedState);
  });

  it('should not accept negative values', () => {
    const sourcePath = 'folder/file';
    const size = -33;
    const state = { ...initialState, logSizes: { [sourcePath]: 1000 } };
    const expectedState = { ...initialState, logSizes: { [sourcePath]: 1000 } };
    const action = {
      type: 'LOGINFO_INCREASE_SIZE',
      data: { sourcePath, size }
    };
    expect(logInfoReducer(state, action)).toEqual(expectedState);
  });

  it('should set number of lines', () => {
    const state = { ...initialState };
    const expectedState = { ...initialState, numberOfLines: 1000 };
    const action = {
      type: 'LOGINFO_SET_NUMBER_OF_LINES',
      data: 1000
    };
    expect(logInfoReducer(state, action)).toEqual(expectedState);
  });
  it("should not add size if size doesn't exist ", () => {
    const sourcePath = 'folder/file';
    const size = 33;
    const state = { ...initialState };
    const expectedState = { ...initialState };
    const action = {
      type: 'LOGINFO_INCREASE_SIZE',
      data: { sourcePath, size }
    };
    expect(logInfoReducer(state, action)).toEqual(expectedState);
  });
});
