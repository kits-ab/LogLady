import { sendRequestToBackend } from '../ipcPublisher';

export const configureStore = (store, send = sendRequestToBackend) => {
  const saveStateToDisk = () => {
    let _state = store.getState();
    delete _state.logInfoReducer;
    delete _state.logViewerReducer;
    sendRequestToBackend({
      function: 'saveState',
      reduxStateValue: JSON.stringify(_state)
    });
  };

  const loadStateFromDisk = () => {
    sendRequestToBackend({ function: 'loadState' });
  };

  const populateStore = _savedStates => {
    Object.entries(_savedStates).forEach(_reducer => {
      store.dispatch({
        type: `${_reducer[0]}Restore`,
        data: _reducer[1]
      });
      if (_reducer[0] === 'menuReducer') {
        initializeOpenFile(_reducer[1].openFiles[0]);
      }
    });
  };

  const initializeOpenFile = filePath => {
    const args = {
      filePath,
      numberOfLines: 5,
      lineNumber: 10
    };
    sendRequestToBackend({
      ...args,
      function: 'liveLines'
    });
    sendRequestToBackend({
      ...args,
      function: 'numberOfLines'
    });
    sendRequestToBackend({
      ...args,
      function: 'fileSize'
    });
  };

  return {
    saveStateToDisk,
    loadStateFromDisk,
    populateStore,
    initializeOpenFile
  };
};
