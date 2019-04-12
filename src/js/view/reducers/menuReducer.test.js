import { menuReducer } from './menuReducer';

it('should return state at unknown type', () => {
  const state = { some: 'state' };
  const action = { type: 'strange_type', data: 'whatever' };
  expect(menuReducer(state, action)).toEqual(state);
});

it('should add file to openFiles', () => {
  const theFilePath = 'hey/ho/lets.go';
  const state = {};
  const action = { type: 'menu_open', data: [theFilePath] };
  const expectedState = { openFiles: [theFilePath] };
  expect(menuReducer(state, action)).toEqual(expectedState);
});

it('should add more files to openFiles', () => {
  const initialFilePath = 'one/two/three.four';
  const theFilePath = 'hey/ho/lets.go';
  const state = { openFiles: [initialFilePath] };
  const action = { type: 'menu_open', data: [theFilePath] };
  const expectedState = { openFiles: [initialFilePath, theFilePath] };
  expect(menuReducer(state, action)).toEqual(expectedState);
});
