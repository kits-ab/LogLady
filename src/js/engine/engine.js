const fileReader = require('../adapters/fileReader');
const diskPersistance = require('../electron/persistToDisk');
const { ipcMain, dialog } = require('electron');
const { createMenu } = require('../electron/menu');
const ipcChannel = 'backendMessages';
const { addRecentFile } = require('./../helpers/recentFilesHelper');
const {
  searchCache,
  updateCache,
  checkIfCacheIsWithinSizeLimit,
  flushCacheForOneFile
} = require('./cache');

const updateRecentFiles = recentFiles => {
  createMenu(recentFiles);
  saveRecentFilesToDisk(recentFiles);
};

const getFileInfo = async filePath => {
  const fileSize = fileReader.getFileSizeInBytes(filePath);
  const endIndex = await fileReader.getLastNewLineIndex(filePath, fileSize);

  return Promise.all([fileSize, endIndex]);
};

const getFileHistory = async (filePath, fileSize) => {
  const nrOfBytes = 120000;
  const startFromByte = 0;
  const {
    startByteOfLines,
    lines,
    linesStartAt,
    linesEndAt
  } = await fileReader.readDataFromByte(filePath, startFromByte, nrOfBytes);

  return { startByteOfLines, lines, linesStartAt, linesEndAt };
};

const sendSourcePicked = (sender, sourcePath) => {
  const action = {
    type: 'SOURCE_PICKED',
    data: {
      sourcePath
    }
  };

  sender.send(ipcChannel, action);
};

const sendFileOpened = async (
  sender,
  filePath,
  fileSize,
  endIndex,
  history
) => {
  const action = {
    type: 'SOURCE_OPENED',
    data: {
      sourceType: 'FILE',
      filePath,
      fileSize,
      endIndex,
      history
    }
  };

  sender.send(ipcChannel, action);
  sendTotalLineCount(filePath, sender);
};

const sendTotalLineCount = async (filePath, sender) => {
  fileReader
    .getLineCount(filePath)
    .then(lineCount => {
      const action = {
        type: 'TOTAL_LINE_AMOUNT_CALCULATED',
        data: {
          filePath,
          lineCount
        }
      };
      sender.send(ipcChannel, action);
    })
    .catch(err => {
      console.log({ sendTotalLineCount, err });
    });
};

const openFile = async (sender, filePath) => {
  try {
    const [fileSize, endIndex] = await getFileInfo(filePath);
    sendSourcePicked(sender, filePath);
    let { startByteOfLines, lines } = await getFileHistory(filePath, fileSize);

    updateCache(filePath, lines, startByteOfLines);

    if (fileSize > 120000) {
      // Send half of the content if the file is bigger than the cached content.
      lines = lines.slice(0, lines.length / 2);
    }

    sendFileOpened(sender, filePath, fileSize, endIndex, lines);
  } catch (error) {
    sendError(sender, "Couldn't read file", error);
    return false;
  }

  return true;
};

const handleOpenFile = async (state, sender, { filePath }) => {
  if (await openFile(sender, filePath)) {
    state.recentFiles = addRecentFile(state.recentFiles, filePath);
    updateRecentFiles(state.recentFiles);
  }
};

const saveRecentFilesToDisk = recentFiles => {
  diskPersistance.saveRecentFilesToDisk(JSON.stringify(recentFiles));
};

const loadRecentFilesFromDisk = () => {
  return diskPersistance.loadRecentFilesFromDisk().then(files => {
    return JSON.parse(files);
  });
};

const loadStateFromDisk = async (state, sender) => {
  diskPersistance
    .loadStateFromDisk()
    .then(_data => {
      const action = {
        type: 'STATE_SET',
        data: JSON.parse(_data)
      };

      sender.send(ipcChannel, action);
    })
    .catch(error => {
      if (error.code === 'ENOENT') return;

      sendError(sender, "Couldn't load previous state from disk", error);
    });
};

const handleFollowSource = (sender, { sourceType, ...rest }) => {
  switch (sourceType) {
    case 'FILE':
      handleFollowFile(sender, rest);
      break;
    default:
      sendError(sender, 'Unknown source type', { code: 'CUSTOM' });
  }
};

const handleFollowFile = (sender, { filePath, fromIndex }) => {
  const onLines = (lines, size) => {
    const action = {
      type: 'LINES_NEW',
      data: {
        sourcePath: filePath,
        lines,
        size
      }
    };

    sender.send(ipcChannel, action);
  };

  const onError = sendError(sender, "Couldn't keep following source");
  fileReader.followFile(filePath, fromIndex, onLines, onError);
};

const handleShowOpenDialog = async (state, sender) => {
  dialog
    .showOpenDialog({
      properties: ['openFile', 'multiSelections']
    })
    .then(infoObject => {
      if (infoObject.filePaths === undefined || infoObject.canceled) return;

      infoObject.filePaths.forEach(async filePath => {
        if (await openFile(sender, filePath)) {
          state.recentFiles = addRecentFile(state.recentFiles, filePath);
          updateRecentFiles(state.recentFiles);
        }
      });
    });
};

const getNewLinesFromCache = async (sender, data) => {
  const {
    sourcePath,
    nrOfLogLines,
    indexForNewLines,
    totalLineCountOfFile
  } = data;

  const [fileSize] = await getFileInfo(sourcePath);

  const searchFromByte = Math.round(
    (fileSize / totalLineCountOfFile) * indexForNewLines
  );

  // first cache search
  let cache = searchCache(sourcePath, searchFromByte, nrOfLogLines);

  if (cache === 'miss' || cache.lines.length < nrOfLogLines) {
    try {
      const nrOfBytes = 120000;
      let byteToReadFrom =
        Math.round(searchFromByte - nrOfBytes / 2) < 0
          ? 0
          : Math.round(searchFromByte - nrOfBytes / 2);

      const { startByteOfLines, lines } = await fileReader.readDataFromByte(
        sourcePath,
        byteToReadFrom,
        nrOfBytes
      );

      // update cache with the new content
      updateCache(sourcePath, lines, startByteOfLines);

      // Check for size and flush if cache is too big
      if (!checkIfCacheIsWithinSizeLimit()) {
        flushCacheForOneFile(sourcePath);
        updateCache(sourcePath, lines, startByteOfLines);
      }

      // Second cache search. Content should now be in the updated cache
      cache = searchCache(sourcePath, searchFromByte, nrOfLogLines);
    } catch (error) {
      console.log({ getNewLinesFromCache }, error);
    }
  }

  const newLines = cache.lines;

  // Send result to frontend
  const dataToReturn = {
    sourcePath,
    newLines,
    indexForNewLines
  };
  const action = {
    type: 'LOGLINES_FETCHED_FROM_BACKEND_CACHE',
    data: { dataToReturn }
  };
  sender.send(ipcChannel, action);
};

const sendError = (sender, message, error) => {
  const errorSender = error => {
    const action = {
      type: 'ERROR',
      data: {
        message,
        error
      }
    };

    sender.send(ipcChannel, action);
  };

  if (error === undefined) {
    return errorSender;
  }

  errorSender(error);
};

const createEventHandler = state => {
  return async (event, _argObj) => {
    const sender = event.sender;
    switch (_argObj.function) {
      case 'DIALOG_OPEN_SHOW':
        handleShowOpenDialog(state, sender);
        break;
      case 'FILE_OPEN':
        handleOpenFile(state, sender, _argObj.data);
        break;
      case 'SOURCE_FOLLOW':
        handleFollowSource(sender, _argObj.data);
        break;
      case 'SOURCE_UNFOLLOW':
        fileReader.stopWatcher(_argObj.filePath);
        break;
      case 'STATE_SAVE':
        diskPersistance.saveStateToDisk(_argObj.reduxStateValue);
        break;
      case 'STATE_LOAD':
        loadStateFromDisk(state, sender);
        break;
      case 'FETCH_NEW_LINES_FROM_BACKEND_CACHE':
        getNewLinesFromCache(sender, _argObj.data).catch(err => {
          console.error(err);
        });
        break;
      default:
    }
  };
};

const start = async () => {
  let recentFiles = [];
  try {
    const loadedRecentFiles = await loadRecentFilesFromDisk();
    recentFiles = loadedRecentFiles;
  } catch (error) {
    console.log(error);
  }

  createMenu(recentFiles);

  const state = { recentFiles };
  ipcMain.on('frontendMessages', createEventHandler(state));
};

module.exports = {
  start
};
