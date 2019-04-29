import { sendRequestToBackend } from '../ipcPublisher';

let argObj = {};
let store;

export const saveStateToDisk = () => {
  argObj.function = 'saveState';
  argObj.reduxStateValue = JSON.stringify(store.getState());
  sendRequestToBackend(argObj);
};

export const loadStateFromDisk = _store => {
  setStore(_store);
  argObj.function = 'loadState';
  sendRequestToBackend(argObj);
};

const setStore = _store => {
  store = _store;
};
