import { configureStore } from './configureStore';

it('should saveStateToDisk', () => {
  const fakeRequester = jest.fn();
  const fakeStore = {
    getState: jest.fn()
  };

  fakeStore.getState.mockReturnValue({
    logInfoState: 'hejhoj',
    logViewerState: 'one',
    menuState: 'menu',
    topPanelState: 'top',
    settingsState: 'settings'
  });

  const publisher = configureStore(fakeStore, fakeRequester);
  publisher.saveStateToDisk();
  expect(fakeRequester.mock.calls.length).toBe(1);

  const saveCall = fakeRequester.mock.calls[0];
  expect(typeof saveCall[0].reduxStateValue).toEqual('string');
  saveCall[0].reduxStateValue = JSON.parse(saveCall[0].reduxStateValue);
  expect(saveCall).toEqual([
    {
      function: 'STATE_SAVE',
      reduxStateValue: {
        topPanelState: 'top',
        menuState: 'menu',
        settingsState: 'settings'
      }
    }
  ]);
});
