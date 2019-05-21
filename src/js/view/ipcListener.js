import {
  setLogSourceFile,
  clearSources
} from 'js/view/actions/dispatchActions';
import { sendRequestToBackend } from 'js/view/ipcPublisher';
const { ipcRenderer } = window.require('electron');

const handleSourceOpened = (
  dispatch,
  { filePath, numberOfLines, fileSize, history }
) => {
  clearSources(dispatch);
  setLogSourceFile(dispatch, filePath, numberOfLines, fileSize, history);

  const followSource = {
    function: 'followSource',
    filePath
  };

  sendRequestToBackend(followSource);
};

export const ipcListener = (store, publisher) => {
  const dispatch = store.dispatch;

  ipcRenderer.on('backendMessages', (event, action) => {
    switch (action.type) {
      case 'saveState':
        publisher.saveStateToDisk();
        break;
      case 'loadState':
        publisher.populateStore(JSON.parse(action.data));
        break;
      case 'sourceOpened':
        handleSourceOpened(dispatch, action);
        break;
      case 'error':
        console.log('Error: ', action.message, ', ', action.error);
        break;
      case 'liveLines':
        dispatch({
          type: 'liveLines',
          filePath: action.filePath,
          lines: action.lines
        });
        break;
      default:
        console.log('Warning: Unrecognized message, ', action);
        break;
    }
  });
};

export const removeAllListeners = () => {
  ipcRenderer.removeAllListeners('backendMessages');
};
