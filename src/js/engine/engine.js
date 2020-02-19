const fileReader = require('../adapters/fileReader');
const { ipcMain, dialog } = require('electron');
const { createMenu } = require('../electron/menu');
const ipcChannel = 'backendMessages';
const { addRecentFile } = require('./../helpers/recentFilesHelper');

const updateRecentFiles = recentFiles => {
  createMenu(recentFiles);
  saveRecentFilesToDisk(recentFiles);
};

const getFileInfo = async filePath => {
  const fileSize = await fileReader.getFileSizeInBytes(filePath);
  const endIndex = fileReader.getLastNewLineIndex(filePath, fileSize);

  return Promise.all([fileSize, endIndex]);
};

const getFileHistory = (filePath, endIndex, numberOfLines) => {
  return fileReader.readNLastLines(filePath, numberOfLines, endIndex);
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
  metaData
) => {
  const action = {
    type: 'SOURCE_OPENED',
    data: {
      sourceType: 'FILE',
      filePath,
      fileSize,
      endIndex,
      history,
      metaData
    }
  };

  sender.send(ipcChannel, action);
};

const openFile = async (sender, filePath) => {
  try {
    const [fileSize, endIndex] = await getFileInfo(filePath);
    sendSourcePicked(sender, filePath);
    const [history, metaData] = await getFileHistory(filePath, endIndex, 10);
    sendFileOpened(sender, filePath, fileSize, endIndex, history, metaData);
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
  fileReader.saveRecentFilesToDisk(JSON.stringify(recentFiles));
};

const loadRecentFilesFromDisk = () => {
  return fileReader.loadRecentFilesFromDisk().then(files => {
    return JSON.parse(files);
  });
};

const loadStateFromDisk = async (state, sender) => {
  fileReader
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
  const APPROXIMATE_BYTES_PER_LINE = 150;
  const { path, startByte, amountOfLines } = data;
  const [fileSize] = await getFileInfo(path);

  let dataToReturn = {
    lines: [],
    linesEndAt: 0,
    metaData: []
  };
  // Convert lines to amount of bytes using approximation
  let bytesPerScreen = amountOfLines * APPROXIMATE_BYTES_PER_LINE;
  let byteToReadFrom = startByte;

  // If too few lines are returned and we have not
  // reached the end of file, keep reading lines
  while (
    dataToReturn.lines.length < amountOfLines &&
    dataToReturn.linesEndAt < fileSize
  ) {
    let data = await fileReader.readDataFromByte(
      path,
      byteToReadFrom,
      bytesPerScreen
    );

    // Save data
    if (!dataToReturn.linesStartAt) {
      dataToReturn.linesStartAt = data.linesStartAt;
    }
    dataToReturn.linesEndAt = data.linesEndAt;
    dataToReturn.lines = dataToReturn.lines.concat(data.lines);
    dataToReturn.metaData = dataToReturn.metaData.concat(data.metaData);

    // Calculate next byte to read from
    // Remove one byte to get one character from previous line,
    // which will be discarded by the adapter
    byteToReadFrom = dataToReturn.linesEndAt - 1;
  }

  // Checking that the amount of lines to return are not too many to be able to fit in the logview.
  if (dataToReturn.lines.length > amountOfLines) {
    dataToReturn.lines = dataToReturn.lines.slice(0, amountOfLines);
  }

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
        fileReader.saveStateToDisk(_argObj.reduxStateValue);
        break;
      case 'STATE_LOAD':
        loadStateFromDisk(state, sender);
        break;
      case 'FETCH_LOGLINES_STARTING_AT_SCROLL_BYTE_POSITION':
        readLinesStartingAtByte(sender, _argObj.data);
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
