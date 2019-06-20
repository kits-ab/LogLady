import { sendRequestToBackend } from '../ipcPublisher';

export const configureStore = (store, send = sendRequestToBackend) => {
  const saveStateToDisk = () => {
    const { topPanelState, settingsState, menuState } = store.getState();
    send({
      function: 'STATE_SAVE',
      reduxStateValue: JSON.stringify({
        topPanelState,
        settingsState,
        menuState
      })
    });
  };

  const loadStateFromDisk = () => {
    send({ function: 'STATE_LOAD' });
  };

  const populateStore = ({ topPanelState, settingsState, menuState }) => {
    store.dispatch({ type: 'MENU_STATE_RESTORE', data: menuState });
    store.dispatch({ type: 'TOP_PANEL_STATE_RESTORE', data: topPanelState });
    store.dispatch({ type: 'SETTINGS_STATE_RESTORE', data: settingsState });
  };

  return {
    saveStateToDisk,
    loadStateFromDisk,
    populateStore
  };
};
