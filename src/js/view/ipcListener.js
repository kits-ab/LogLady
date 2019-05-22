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
    function: 'SOURCE_FOLLOW',
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

  ipcRenderer.on('backendMessages', (_event, action) => {
    switch (action.type) {
      case 'QUIT':
        publisher.saveStateToDisk();
        break;
      case 'STATE_SET':
        publisher.populateStore(JSON.parse(action.data));
        break;
      case 'SOURCE_OPENED':
        handleSourceOpened(dispatch, action);
        break;
      case 'ERROR':
        handleError(dispatch, action);
        break;
      case 'LINES_NEW':
        dispatch({
          type: 'LOGVIEWER_ADD_LINES',
          data: {
            filePath: action.filePath,
            lines: action.lines
          }
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
