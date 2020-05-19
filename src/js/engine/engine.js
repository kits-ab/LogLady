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
const { version } = require('../../../package.json');

const CACHE_CHUNK_SIZE = 500_000;

const updateRecentFiles = recentFiles => {
  createMenu(recentFiles);
  saveRecentFilesToDisk(recentFiles);
};

const getFileInfo = async filePath => {
  const fileSize = fileReader.getFileSizeInBytes(filePath);
  const endIndex = await fileReader.getLastNewLineIndex(filePath, fileSize);

  return Promise.all([fileSize, endIndex]);
};

const getFileHistory = async filePath => {
  const startFromByteBegin = 0;

  const beginningOfFile = await fileReader.readDataFromByte(
    filePath,
    startFromByteBegin,
    CACHE_CHUNK_SIZE
  );
  return { beginningOfFile };
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
  sender.send(ipcChannel, { type: 'SAVE_CURRENT_STATE' });
};

const sendTotalLineCount = async (filePath, sender) => {
  try {
    const lineCount = await fileReader.getLineCount(filePath);
    const action = {
      type: 'TOTAL_LINE_AMOUNT_CALCULATED',
      data: {
        filePath,
        lineCount
      }
    };
    sender.send(ipcChannel, action);
  } catch (error) {
    console.log({ sendTotalLineCount, error });
  }
};

const openFile = async (sender, filePath) => {
  try {
    const [fileSize, endIndex] = await getFileInfo(filePath);
    sendSourcePicked(sender, filePath);
    let { beginningOfFile } = await getFileHistory(filePath);

    if (fileSize > CACHE_CHUNK_SIZE) {
      // add both the beginning to the cache if the file is large enough to need a cache
      updateCache(
        filePath,
        beginningOfFile.lines,
        beginningOfFile.startByteOfLines
      );
      // Cut the lines in half if the file is larger than the initial cached chunk
      beginningOfFile.lines = beginningOfFile.lines.slice(
        0,
        beginningOfFile.lines.length / 2
      );
    }

    sendFileOpened(sender, filePath, fileSize, endIndex, beginningOfFile.lines);
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

const loadRecentFilesFromDisk = async () => {
  const files = await diskPersistance.loadRecentFilesFromDisk();
  return JSON.parse(files);
};

const loadStateFromDisk = async (state, sender) => {
  diskPersistance
    .loadStateFromDisk()
    .then(_data => {
      const data = JSON.parse(_data);
      // slice to skip the v in ex v2.0.0
      if (data.version === version.slice(1)) {
        const action = {
          type: 'STATE_SET',
          data: data
        };

        sender.send(ipcChannel, action);
      }
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
    totalLineCountOfFile,
    getEndOfFile
  } = data;
  const [fileSize] = await getFileInfo(sourcePath);
  const approximateBytesPerRow = Math.round(fileSize / totalLineCountOfFile);
  const searchFromByte = approximateBytesPerRow * indexForNewLines;

  if (getEndOfFile) {
    // The requested content contains the end of the file. To make sure that the current end is being returned, in case the file is running, have fileReader read the correct ending, add it to the cache and send to frontend.
    const endOfFile = await fileReader.readDataFromByte(
      sourcePath,
      fileSize - CACHE_CHUNK_SIZE,
      CACHE_CHUNK_SIZE
    );

    updateCache(sourcePath, endOfFile.lines, endOfFile.startByteOfLines);

    const dataToReturn = {
      sourcePath,
      newLines: endOfFile.lines.slice(endOfFile.lines.length - nrOfLogLines),
      indexForNewLines,
      isEndOfFile: true
    };
    const action = {
      type: 'LOGLINES_FETCHED_FROM_BACKEND_CACHE',
      data: { dataToReturn }
    };

    sender.send(ipcChannel, action);
  } else {
    let cache = searchCache(sourcePath, searchFromByte, nrOfLogLines, fileSize);
    try {
      if (cache === 'miss') {
        const byteToReadFrom = searchFromByte - 2000;
        let nrOfBytesToRead = CACHE_CHUNK_SIZE;

        const { startByteOfLines, lines } = await fileReader.readDataFromByte(
          sourcePath,
          byteToReadFrom,
          nrOfBytesToRead
        );

        updateCache(sourcePath, lines, startByteOfLines);

        const [fileSize] = await getFileInfo(sourcePath);
        await flushAndUpdateCacheIfOverSizeLimit(
          sourcePath,
          lines,
          startByteOfLines,
          fileSize
        );

        cache = searchCache(sourcePath, searchFromByte, nrOfLogLines, fileSize);
      }

      if (cache !== 'miss') {
        const newLines = cache.lines;
        const isEndOfFile = cache.isEndOfFile;
        // Send result to frontend
        const dataToReturn = {
          sourcePath,
          newLines,
          indexForNewLines,
          isEndOfFile
        };
        const action = {
          type: 'LOGLINES_FETCHED_FROM_BACKEND_CACHE',
          data: { dataToReturn }
        };
        sender.send(ipcChannel, action);
      }
    } catch (error) {
      console.log({ getNewLinesFromCache }, error);
    }
  }
};

const flushAndUpdateCacheIfOverSizeLimit = async (
  sourcePath,
  lines,
  startByteOfLines,
  fileSize
) => {
  if (!checkIfCacheIsWithinSizeLimit()) {
    flushCacheForOneFile(sourcePath);
    updateCache(sourcePath, lines, startByteOfLines);
    // Make sure that the cache contains the end of the file
    const endOfFile = await fileReader.readDataFromByte(
      sourcePath,
      fileSize - CACHE_CHUNK_SIZE,
      CACHE_CHUNK_SIZE
    );
    updateCache(sourcePath, endOfFile.lines, endOfFile.startByteOfLines);
  }
};

const getFilteredLines = async (sender, data) => {
  const { sourcePath, filterRegexString, previousFilteredLinesLength } = data;
  let filterRegex;
  const [endIndex] = await getFileInfo(sourcePath);
  let lines;
  if (filterRegexString) {
    let [, pattern, flags] = /\/(.*)\/(.*)/.exec(filterRegexString);
    filterRegex = new RegExp(`(${pattern})`, flags);
  }

  if (previousFilteredLinesLength !== 0) {
    //If file have previously been filtered read the last 10 lines and filter those using filterRegex.
    lines = await fileReader.readNLastLines(sourcePath, 10, endIndex);
    lines = lines.filter(line => {
      return filterRegex.test(line);
    });
  } else {
    //If previousFilteredLinesLength is 0, read the whole file
    lines = await fileReader.readFileWithStream(sourcePath, filterRegex);
  }

  const dataToReturn = {
    sourcePath,
    filteredLines: lines,
    filterString: filterRegexString
  };

  const action = {
    type: 'LOGLINES_FILTERED',
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
        await getNewLinesFromCache(sender, _argObj.data).catch(err => {
          console.error(err);
        });
        break;
      case 'FETCH_FILTERED_LINES_FROM_BACKEND':
        getFilteredLines(sender, _argObj.data).catch(err => {
          console.error(err);
        });
        break;
      case 'ON_TAB_CLOSE':
        flushCacheForOneFile(_argObj.filePath);
        sender.send(ipcChannel, { type: 'SAVE_CURRENT_STATE' });
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
