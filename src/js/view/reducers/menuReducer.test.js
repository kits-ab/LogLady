import { menuReducer, isValidState } from './menuReducer';

describe('menu reducer', () => {
  const initialState = {
    nextIndex: 0,
    openSources: {},
    currentSourceHandle: undefined
  };
  it('should return state at unknown type', () => {
    const state = { some: 'state' };
    const action = { type: 'strange_type', data: 'whatever' };
    expect(menuReducer(state, action)).toEqual(state);
  });

  it('should set set openSources and currentSource', () => {
    const filePath = 'hey/ho/lets.go';
    const state = { ...initialState };
    const action = { type: 'MENU_SET_SOURCE', data: { sourcePath: filePath } };
    const expectedState = {
      nextIndex: 1,
      openSources: { 0: { path: filePath, index: 0 } },
      currentSourceHandle: 0
    };
    expect(menuReducer(state, action)).toEqual(expectedState);
  });

  it('should update index on the exact same action', () => {
    const filePath = 'hey/ho/lets.go';
    const state = { ...initialState };
    const action = { type: 'MENU_SET_SOURCE', data: { sourcePath: filePath } };
    const expectedState = {
      nextIndex: 2,
      openSources: { 1: { path: filePath, index: 1 } },
      currentSourceHandle: 1
    };
    expect(menuReducer(menuReducer(state, action), action)).toEqual(
      expectedState
    );
  });

  it('should not reset index on clear', () => {
    const state = { ...initialState, nextIndex: 12 };
    const action = { type: 'MENU_CLEAR' };
    const expectedState = {
      nextIndex: 12,
      openSources: {},
      currentSourceHandle: undefined
    };
    expect(menuReducer(state, action)).toEqual(expectedState);
  });

  it('should reset everything but index on clear', () => {
    const state = {
      nextIndex: 3,
      openSources: { 0: { path: 'dsfdsf', index: 2 } },
      currentSourceHandle: 2
    };
    const action = { type: 'MENU_CLEAR' };
    const expectedState = {
      nextIndex: 3,
      openSources: {},
      currentSourceHandle: undefined
    };
    expect(menuReducer(state, action)).toEqual(expectedState);
  });

  describe('isValidState', () => {
    it('should consider the initial state valid', () => {
      expect(isValidState(initialState)).toEqual(true);
    });

    it('should consider the a good state valid', () => {
      const state = {
        openSources: {
          0: { path: 'file1', index: 0 },
          1: { path: 'file2', index: 1 }
        },
        nextIndex: 2
      };

      expect(isValidState(state)).toEqual(true);
    });

    it('should consider incomplete state invalid', () => {
      const state = {};

      expect(isValidState(state)).toEqual(false);
    });
  });
});
