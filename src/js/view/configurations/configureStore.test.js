import { configureStore } from './configureStore';

it('should saveStateToDisk', () => {
  const fakeRequester = jest.fn();
  const fakeStore = {
    getState: jest.fn()
  };

  fakeStore.getState.mockReturnValue({
    logInfoReducer: 'hejhoj',
    logViewerReducer: 'one',
    testStuff: 'two'
  });

  const publisher = configureStore(fakeStore, fakeRequester);
  publisher.saveStateToDisk();
  expect(fakeRequester.mock.calls.length).toBe(1);
  expect(fakeRequester.mock.calls[0]).toEqual([
    {
      function: 'STATE_SAVE',
      reduxStateValue: '{"testStuff":"two"}'
    }
  ]);
});
