import {
  saveStateToDisk,
  populateStore
} from './configurations/configureStore';
import { initializeOpenFile } from './configurations/configureStore';
const { ipcRenderer } = window.require('electron');

export const ipcListener = (dispatch, state) => {
  ipcRenderer.on('backendMessages', (event, action) => {
    switch (action.type) {
      case 'menu_open':
        dispatch({
          type: action.type,
          data: action.data
        });
        initializeOpenFile(action.data[0]);
        break;
      case 'saveState':
        saveStateToDisk();
        break;
      case 'loadState':
        populateStore(JSON.parse(action.data));
        break;
      case 'backendError':
        //handle errors in the future
        // alert('Error occured. ', action.data);
        console.log('Error from the backend: ', action.data);
        break;
      default:
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
    }
  });
};

export const removeAllListeners = () => {
  ipcRenderer.removeAllListeners('backendMessages');
};
