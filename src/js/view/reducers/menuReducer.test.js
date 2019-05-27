import { menuReducer, isValidState } from './menuReducer';

it('should return state at unknown type', () => {
  const state = { some: 'state' };
  const action = { type: 'strange_type', data: 'whatever' };
  expect(menuReducer(state, action)).toEqual(state);
});

it('should set openSources to specified file', () => {
  const filePath = 'hey/ho/lets.go';
  const state = {};
  const action = { type: 'MENU_SET_SOURCE', data: { sourcePath: filePath } };
  const expectedState = { openSources: [filePath] };
  expect(menuReducer(state, action)).toEqual(expectedState);
});

describe('isValidState', () => {
  it('should consider the initial state valid', () => {
    const initialState = { openSources: [] };

    expect(isValidState(initialState)).toEqual(true);
  });

  it('should consider the a good state valid', () => {
    const initialState = { openSources: ['file1', 'file2'] };

    expect(isValidState(initialState)).toEqual(true);
  });

  it('should consider non-strings invalid', () => {
    const initialState = { openSources: [1] };

    expect(isValidState(initialState)).toEqual(false);
  });
});
