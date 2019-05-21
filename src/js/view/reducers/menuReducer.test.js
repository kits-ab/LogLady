import { menuReducer } from './menuReducer';

it('should return state at unknown type', () => {
  const state = { some: 'state' };
  const action = { type: 'strange_type', data: 'whatever' };
  expect(menuReducer(state, action)).toEqual(state);
});

it('should set openSources to specified file', () => {
  const filePath = 'hey/ho/lets.go';
  const state = {};
  const action = { type: 'setLogSource', filePath: filePath };
  const expectedState = { openSources: [filePath] };
  expect(menuReducer(state, action)).toEqual(expectedState);
});
