import {
  setFileData,
  setSource,
  showSnackBar,
  addNewLines,
  increaseSize,
  setLastSeenLogSizeToSize,
  addLinesFetchedFromBackendCache,
  addCalculatedAmountOfLines,
  addFilteredLines
} from 'js/view/actions/dispatchActions';
import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { prettifyErrorMessage } from 'js/view/components/helpers/errorHelper';
import { openFile } from './components/helpers/handleFileHelper';

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
  let sourcesToOpen = [];

  // Get all sources to open
  if (state.menuState) {
    Object.values(state.menuState.openSources).forEach(openSource => {
      sourcesToOpen.push(openSource);
    });

    // Set previously opened file to undefined so it isn't opened if the opening process fails
    state.menuState.currentSourceHandle = undefined;
  }

  publisher.populateStore(state);

  // Open all files after the store is populated
  if (sourcesToOpen) {
    sourcesToOpen.forEach(sourceToOpen => {
      openFile(sourceToOpen.path);
    });
  }
};

const handleFileOpened = (
  dispatch,
  { filePath, fileSize, endIndex, history, lineCount }
) => {
  // clearAllLogs(dispatch);
  setFileData(dispatch, filePath, fileSize, history);
  setLastSeenLogSizeToSize(dispatch, filePath, fileSize);

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

const handleLinesFromBackendCache = (dispatch, { dataToReturn }) => {
  addLinesFetchedFromBackendCache(
    dispatch,
    dataToReturn.sourcePath,
    dataToReturn.newLines,
    dataToReturn.indexForNewLines,
    dataToReturn.isEndOfFile
  );
};

const handleLineAmount = (dispatch, { filePath, lineCount }) => {
  addCalculatedAmountOfLines(dispatch, filePath, lineCount);
};

const handleError = (dispatch, { message, error }) => {
  const errorMessage = prettifyErrorMessage(message, error);
  showSnackBar(dispatch, errorMessage, 'error');
};

const handleFilteredLines = (dispatch, { dataToReturn }) => {
  addFilteredLines(
    dispatch,
    dataToReturn.sourcePath,
    dataToReturn.filteredLines,
    dataToReturn.filterString
  );
};

export const ipcListener = (store, publisher) => {
  const dispatch = store.dispatch;

  window.ipcRenderer.on('backendMessages', (_event, action) => {
    switch (action.type) {
      case 'SAVE_CURRENT_STATE':
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
      case 'TOTAL_LINE_AMOUNT_CALCULATED':
        handleLineAmount(dispatch, action.data);
        break;
      case 'ERROR':
        handleError(dispatch, action.data);
        break;
      case 'LINES_NEW':
        handleNewLines(dispatch, action.data);
        break;
      case 'LOGLINES_FETCHED_FROM_BACKEND_CACHE':
        handleLinesFromBackendCache(dispatch, action.data);
        break;
      case 'LOGLINES_FILTERED':
        handleFilteredLines(dispatch, action.data);
        break;
      default:
        console.log('Warning: Unrecognized message, ', action);
        break;
    }
  });
};

export const removeAllListeners = () => {
  window.ipcRenderer.removeAllListeners('backendMessages');
};
