import { sendRequestToBackend } from '../ipcPublisher';

let argObj = {};
let store;

export const saveStateToDisk = () => {
  let _state = store.getState();
  delete _state.logInfoReducer;
  delete _state.logViewerReducer;
  argObj.function = 'saveState';
  argObj.reduxStateValue = JSON.stringify(_state);
  sendRequestToBackend(argObj);
};

export const loadStateFromDisk = () => {
  argObj.function = 'loadState';
  sendRequestToBackend(argObj);
};

export const setStore = _store => {
  store = _store;
};

export const populateStore = _savedStates => {
  Object.entries(_savedStates).forEach(_reducer => {
    store.dispatch({
      type: `${_reducer[0]}Restore`,
      data: _reducer[1]
    });
    if (_reducer[0] === 'menuReducer') {
      console.log('initializing file yo...');
      initializeOpenFile(_reducer[1].openFiles[0]);
    }
  });
};

export const initializeOpenFile = filePath => {
  console.log('initialize open file.....');
  argObj.filePath = filePath;
  argObj.numberOfLines = 5;
  argObj.lineNumber = 10;
  argObj.function = 'liveLines';
  sendRequestToBackend(argObj);
  argObj.function = 'numberOfLines';
  sendRequestToBackend(argObj);
  argObj.function = 'fileSize';
  sendRequestToBackend(argObj);
};
