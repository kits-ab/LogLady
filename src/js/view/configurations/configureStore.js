import { sendRequestToBackend } from '../ipcPublisher';

export const configureStore = (store, send = sendRequestToBackend) => {
  const saveStateToDisk = () => {
    let _state = store.getState();
    delete _state.logInfoReducer;
    delete _state.logViewerReducer;
    send({
      function: 'saveState',
      reduxStateValue: JSON.stringify(_state)
    });
  };

  const loadStateFromDisk = () => {
    send({ function: 'loadState' });
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
    send({
      ...args,
      function: 'liveLines'
    });
    send({
      ...args,
      function: 'numberOfLines'
    });
    send({ ...args, function: 'fileSize' });
  };

  return {
    saveStateToDisk,
    loadStateFromDisk,
    populateStore,
    initializeOpenFile
  };
};
