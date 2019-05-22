import { snackBarReducer } from './snackBarReducer';

describe('snackbar reducer', () => {
  const initialState = {
    show: false,
    message: '',
    level: 'info',
    fadeAfter: 0
  };

  it('should return the initial state', () => {
    expect(snackBarReducer(undefined, {})).toEqual(initialState);
  });

  it('should set show to false', () => {
    const state = {
      ...initialState,
      show: true
    };
    const expectedResult = {
      ...initialState,
      show: false
    };
    const action = {
      type: 'SNACKBAR_HIDE',
      data: { instant: false }
    };
    expect(snackBarReducer(state, action)).toEqual(expectedResult);
  });

  it('should set show to false and turn off fade', () => {
    const state = {
      ...initialState,
      show: true,
      fadeAfter: 100
    };
    const expectedResult = {
      ...initialState,
      show: false,
      fadeAfter: 0
    };
    const action = {
      type: 'SNACKBAR_HIDE',
      data: { instant: true }
    };
    expect(snackBarReducer(state, action)).toEqual(expectedResult);
  });

  it('should set show to true and update state', () => {
    const state = {
      ...initialState,
      show: false
    };
    const content = {
      message: 'message',
      level: 'error',
      fadeAfter: 100
    };
    const expectedResult = {
      ...initialState,
      show: true,
      ...content
    };
    const action = {
      type: 'SNACKBAR_SHOW_NEW',
      data: { ...content }
    };
    expect(snackBarReducer(state, action)).toEqual(expectedResult);
  });
});
