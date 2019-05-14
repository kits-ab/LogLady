import { configureStore } from './configureStore';

it('should saveStateToDisk', () => {
  const fakeStore = {
    getState: () => {
      console.log('getState invoked');
      return {
        logInfoReducer: 'hejhoj',
        logViewerReducer: 'one',
        testStuff: 'two'
      };
    }
  };
  const fakeRequester = params => {
    expect(params).toEqual({
      function: 'saveState',
      reduxStateValue: '{"testStuff":"two"}'
    });
  };

  const publisher = configureStore(fakeStore, fakeRequester);
  publisher.saveStateToDisk();
});
