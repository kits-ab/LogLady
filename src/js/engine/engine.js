const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const ipcChannel = 'backendMessages';

const getFileInfo = async filePath => {
  const fileSize = await fileReader.getFileSizeInBytes(filePath);
  const endIndex = fileReader.getLastNewLineIndex(filePath, fileSize);

  // [endIndex, fileSize]
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
};

const openFile = async (sender, filePath) => {
  try {
    const [fileSize, endIndex] = await getFileInfo(filePath);
    sendSourcePicked(sender, filePath);
    const history = await getFileHistory(filePath, endIndex, 10);
    sendFileOpened(sender, filePath, fileSize, endIndex, history);
  } catch (error) {
    sendError(sender, "Couldn't read file", error);
  }
};

const handleOpenFile = (sender, { filePath }) => {
  openFile(sender, filePath);
};

const saveRecentFilesToDisk = _recentFiles => {
  fileReader.saveRecentFilesToDisk(_recentFiles);
};

const loadRecentFilesFromDisk = () => {
  return fileReader.loadRecentFilesFromDisk();
};

const loadStateFromDisk = sender => {
  fileReader
    .loadStateFromDisk()
    .then(_data => {
      let previousSource = '';
      try {
        previousSource = JSON.parse(_data).menuReducer.openSources[0];
      } catch (_error) {
        throw customError("couldn't parse JSON");
      }

      if (previousSource) {
        openFile(sender, previousSource);
      }

      const action = {
        type: 'STATE_SET',
        data: _data
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

const handleShowOpenDialog = async sender => {
  dialog.showOpenDialog(
    {
      properties: ['openFile']
    },
    async filePaths => {
      if (filePaths === undefined) return;

      const filePath = filePaths[0];
      await openFile(sender, filePath);
      menu.handleRecentFiles(filePath);
    }
  );
};

ipcMain.on('frontendMessages', async (event, _argObj) => {
  const sender = event.sender;
  switch (_argObj.function) {
    case 'DIALOG_OPEN_SHOW':
      handleShowOpenDialog(sender);
      break;
    case 'FILE_OPEN':
      handleOpenFile(sender, _argObj.data);
      break;
    case 'SOURCE_FOLLOW':
      fileReader.stopAllWatchers();
      handleFollowSource(sender, _argObj.data);
      break;
    case 'SOURCE_UNFOLLOW':
      fileReader.stopWatcher(_argObj);
      break;
    case 'STATE_SAVE':
      fileReader.saveStateToDisk(_argObj.reduxStateValue);
      break;
    case 'STATE_LOAD':
      loadStateFromDisk(sender);
      break;
    default:
  }
});

const customError = reason => {
  return { code: 'CUSTOM', reason: reason };
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

module.exports = {
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};

const menu = require('../electron/menu');
