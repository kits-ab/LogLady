import {
  setFileSource,
  clearAllLogs,
  showSnackBar,
  addNewLines
} from 'js/view/actions/dispatchActions';
import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { prettifyErrorMessage } from 'js/view/components/helpers/errorHelper';
const { ipcRenderer } = window.require('electron');

const handleSourceOpened = (dispatch, { sourceType, ...rest }) => {
  switch (sourceType) {
    case 'FILE':
      console.log(rest);
      handleFileOpened(dispatch, rest);
      break;
    default:
      console.log('ipcListener.js: Unknown source type');
  }
};

const handleFileOpened = (
  dispatch,
  { filePath, lineCount, lastLineEndIndex, fileSize, history }
) => {
  clearAllLogs(dispatch);
  setFileSource(dispatch, filePath, lineCount, fileSize, history);

  const followSource = {
    function: 'SOURCE_FOLLOW',
    data: {
      sourceType: 'FILE',
      filePath,
      fromIndex: lastLineEndIndex
    }
  };
  sendRequestToBackend(followSource);
};

const handleNewLines = (dispatch, { sourcePath, lines }) => {
  addNewLines(dispatch, sourcePath, lines);
};

const handleError = (dispatch, { message, error }) => {
  const errorMessage = prettifyErrorMessage(message, error);
  showSnackBar(dispatch, errorMessage, 'error', 20000);
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
        handleSourceOpened(dispatch, action.data);
        break;
      case 'ERROR':
        handleError(dispatch, action.data);
        break;
      case 'LINES_NEW':
        handleNewLines(dispatch, action.data);
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
