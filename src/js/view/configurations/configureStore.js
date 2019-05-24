import { sendRequestToBackend } from '../ipcPublisher';

export const configureStore = (store, send = sendRequestToBackend) => {
  const saveStateToDisk = () => {
    let _state = store.getState();
    delete _state.logInfoReducer;
    delete _state.logViewerReducer;
    send({
      function: 'STATE_SAVE',
      reduxStateValue: JSON.stringify(_state)
    });
  };

  const loadStateFromDisk = () => {
    send({ function: 'STATE_LOAD' });
  };

  const populateStore = _savedStates => {
    Object.entries(_savedStates).forEach(_reducer => {
      store.dispatch({
        type: `${_reducer[0]}Restore`,
        data: _reducer[1]
      });
    });
  };

  return {
    saveStateToDisk,
    loadStateFromDisk,
    populateStore
  };
};
