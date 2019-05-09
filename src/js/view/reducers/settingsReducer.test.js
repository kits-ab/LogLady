import { settingsReducer } from './settingsReducer';

describe('settingsReducer', () => {
  const initialState = {
    showSettings: false,
    highlightColor: 'red',
    wrapLineOn: false
  };

  it('should return the initial state', () => {
    expect(settingsReducer(undefined, {})).toEqual(initialState);
  });

  it('should toggle showSettings ', () => {
    const state = {
      ...initialState,
      showSettings: false
    };

    const expectedState = {
      ...state,
      showSettings: true
    };

    const action = {
      type: 'showSettings'
    };

    expect(settingsReducer(state, action)).toEqual(expectedState);
    expect(settingsReducer(expectedState, action)).toEqual(state);
  });

  it('should set highlightColor ', () => {
    const expectedState = {
      ...initialState,
      highlightColor: 'yellow'
    };
    const action = {
      type: 'highlightColor',
      data: 'yellow'
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
  });
  it('should toggle wrapLineOn ', () => {
    const expectedState = {
      ...initialState,
      wrapLineOn: true
    };

    const action = {
      type: 'wrapLineOn'
    };

    expect(settingsReducer(initialState, action)).toEqual(expectedState);
    expect(settingsReducer(expectedState, action)).toEqual(initialState);
  });
});
