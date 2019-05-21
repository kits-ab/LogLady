import {
  setLogSourceFile,
  clearSources,
  showSnackBar
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

const prettifyErrorMessage = (message, error) => {
  switch (error.code) {
    case 'EACCES':
      return `${message} ${error.path} permission denied`;
    case 'EISDIR':
      return `${message} ${error.path} is a directory`;
    case 'ENOENT':
      return `${message} ${error.path} does not exist`;
    default:
      return message;
  }
};

const handleError = (dispatch, { message, error }) => {
  const errorMessage = prettifyErrorMessage(message, error);
  showSnackBar(dispatch, errorMessage, 'error');
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
        handleError(dispatch, action);
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
