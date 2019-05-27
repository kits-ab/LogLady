import { menuReducer } from './menuReducer';

describe('menu reducer', () => {
  const initialState = {
    nextIndex: 0,
    openSources: [],
    currentSource: undefined
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
    const source = { path: filePath, index: 0 };
    const expectedState = {
      nextIndex: 1,
      openSources: [source],
      currentSource: source
    };
    expect(menuReducer(state, action)).toEqual(expectedState);
  });

  it('should update index at the same action', () => {
    const filePath = 'hey/ho/lets.go';
    const state = { ...initialState };
    const action = { type: 'MENU_SET_SOURCE', data: { sourcePath: filePath } };
    const source = { path: filePath, index: 1 };
    const expectedState = {
      nextIndex: 2,
      openSources: [source],
      currentSource: source
    };
    expect(menuReducer(menuReducer(state, action), action)).toEqual(
      expectedState
    );
  });
});
