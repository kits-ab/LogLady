const fileReader = require('../adapters/fileReader');
const diskPersistance = require('../electron/persistToDisk');
const { ipcMain, dialog } = require('electron');
const { createMenu } = require('../electron/menu');
const ipcChannel = 'backendMessages';
const { addRecentFile } = require('./../helpers/recentFilesHelper');
const {
  createCache,
  searchCache,
  updateCache,
  flushCache,
  checkIfCacheIsWithinSizeLimit,
  flushCacheForOneFile
} = require('./cache');

const updateRecentFiles = recentFiles => {
  createMenu(recentFiles);
  saveRecentFilesToDisk(recentFiles);
};

const getFileInfo = filePath => {
  const fileSize = fileReader.getFileSizeInBytes(filePath);
  const endIndex = fileReader.getLastNewLineIndex(filePath, fileSize);

  return Promise.all([fileSize, endIndex]);
};

const getFileHistory = async (filePath, fileSize) => {
  const NR_OF_BYTES = 30000;
  const START_READ_FROM_BYTE =
    fileSize - NR_OF_BYTES < 0 ? 0 : fileSize - NR_OF_BYTES;
  const {
    startByteOfLines,
    lines,
    linesStartAt,
    linesEndAt
  } = await fileReader.readDataFromByte(
    filePath,
    START_READ_FROM_BYTE,
    NR_OF_BYTES
  );
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
  history,
  startByteOfLines
) => {
  const action = {
    type: 'SOURCE_OPENED',
    data: {
      sourceType: 'FILE',
      filePath,
      fileSize,
      endIndex,
      history,
      startByteOfLines
    }
  };

  sender.send(ipcChannel, action);
};

// Invisible character U+2800 being used in line.replace
const replaceEmptyLinesWithHiddenChar = arr => {
  const regexList = [/^\s*$/];
  return arr.map(line => {
    const isMatch = regexList.some(rx => {
      return rx.test(line);
    });
    return isMatch ? line.replace(regexList[0], '⠀') : line;
  });
};

const openFile = async (sender, filePath) => {
  try {
    const [fileSize, endIndex] = await getFileInfo(filePath);
    sendSourcePicked(sender, filePath);
    const {
      startByteOfLines,
      lines,
      linesStartAt,
      linesEndAt
    } = await getFileHistory(filePath, fileSize);

    updateCache(filePath, lines, startByteOfLines);

    //Lines in history that contains empty spaces does not display properly. replaceEmptyLinesWithHiddenChar(history) returns an array where this has been taken care of by replacing each space with a hidden character, and makes those lines display correctly in LogViewer.
    sendFileOpened(
      sender,
      filePath,
      fileSize,
      endIndex,
      replaceEmptyLinesWithHiddenChar(lines.slice(lines.length - 10)),
      startByteOfLines.slice(startByteOfLines.length - 10)
    );
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

const readLinesStartingAtByte = async (sender, data) => {
  // TODO:
  // searchCache(filePath, position, amountOfLines) finns datan i cache? -> Returnera från cache
  // finns datan inte i cache? -> läs in updateCache
  // kolla strl på cache
  // för stor -> flushCache -> updateCache
  // strl ok -> searchCache
  // Returnera resultatet från searchCache

  const { path, startByte, amountOfLines } = data;
  const [fileSize] = await getFileInfo(path);
  // .catch(error =>
  //   console.error(error)
  // );
  const numberOfBytes = 30000;
  let byteToReadFrom = startByte - 15000 < 0 ? 0 : startByte - 15000;
  let cache = searchCache(path, startByte, amountOfLines);

  if (cache === 'miss') {
    console.log('cache = miss');
    try {
      const {
        startByteOfLines,
        lines,
        linesStartAt,
        linesEndAt
      } = await fileReader.readDataFromByte(
        path,
        byteToReadFrom,
        numberOfBytes
      );

      updateCache(path, lines, startByteOfLines);

      //Check for size
      if (!checkIfCacheIsWithinSizeLimit()) {
        flushCacheForOneFile(path);
        updateCache(path, lines, startByteOfLines);
      }

      cache = searchCache(path, byteToReadFrom, amountOfLines);
    } catch (error) {
      console.log({ readLinesStartingAtByte }, error);
    }
  }

  let { lines, startsAtByte } = cache;
  lines = replaceEmptyLinesWithHiddenChar(lines);

  const dataToReturn = { path, lines, startByteOfLines: startsAtByte };
  const action = {
    type: 'LOGLINES_FETCHED_FROM_BYTEPOSITION',
    data: { dataToReturn, path }
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
      case 'FETCH_LOGLINES_STARTING_AT_SCROLL_BYTE_POSITION':
        readLinesStartingAtByte(sender, _argObj.data).catch(err => {
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
