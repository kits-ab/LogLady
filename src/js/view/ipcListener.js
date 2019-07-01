import {
  setFileData,
  setSource,
  clearAllLogs,
  showSnackBar,
  addNewLines,
  increaseSize
} from 'js/view/actions/dispatchActions';
import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { prettifyErrorMessage } from 'js/view/components/helpers/errorHelper';
import { openFile } from './components/helpers/handleFileHelper';
const { ipcRenderer } = window.require('electron');

const handleSourcePicked = (dispatch, { sourcePath }) => {
  setSource(dispatch, sourcePath);
};

const handleSourceOpened = (dispatch, { sourceType, ...rest }) => {
  switch (sourceType) {
    case 'FILE':
      handleFileOpened(dispatch, rest);
      break;
    default:
      console.log('ipcListener.js: Unknown source type');
  }
};

const handleStateSet = (publisher, state) => {
  let openedSource;

  // Save previously opened source for reopening of the file
  if (state.menuState) {
    const openedSourceHandle = state.menuState.currentSourceHandle;
    openedSource = (state.menuState.openSources || {})[openedSourceHandle];

    // Set previously opened file to undefined so it isn't opened if the opening process fails
    state.menuState.currentSourceHandle = undefined;
  }

  publisher.populateStore(state);

  // Open file after the store is populated
  if (openedSource) openFile(openedSource.path);
};

const handleFileOpened = (
  dispatch,
  { filePath, fileSize, endIndex, history }
) => {
  clearAllLogs(dispatch);
  setFileData(dispatch, filePath, fileSize, history);

  const followSource = {
    function: 'SOURCE_FOLLOW',
    data: {
      sourceType: 'FILE',
      filePath,
      fromIndex: endIndex
    }
  };
  sendRequestToBackend(followSource);
};

const handleNewLines = (dispatch, { sourcePath, lines, size }) => {
  addNewLines(dispatch, sourcePath, lines);
  increaseSize(dispatch, sourcePath, size);
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
        handleStateSet(publisher, action.data);
        break;
      case 'SOURCE_PICKED':
        handleSourcePicked(dispatch, action.data);
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
