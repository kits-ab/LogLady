import { closeFile } from './components/helpers/handleFileHelper';
const { ipcRenderer } = window.require('electron');

export const ipcListener = (store, publisher) => {
  const dispatch = store.dispatch;
  closeFile(dispatch, 'initializing');

  ipcRenderer.on('backendMessages', (event, action) => {
    switch (action.type) {
      case 'menu_open':
        if (store.getState().menuReducer.openFiles) {
          closeFile(dispatch, store.getState().menuReducer.openFiles[0]);
        }
        dispatch({
          type: action.type,
          data: action.data
        });
        publisher.initializeOpenFile(action.data[0]);
        break;
      case 'saveState':
        publisher.saveStateToDisk();
        break;
      case 'loadState':
        publisher.populateStore(JSON.parse(action.data));
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
