const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const ipcChannel = 'backendMessages';

const getFileInfo = async filePath => {
  const fileSize = await fileReader.getFileSizeInBytes(filePath);
  console.log('FILESIZE: ', fileSize);
  const endIndex = await fileReader.getLastNewLineIndex(filePath, fileSize);

  console.log('ENDINDEX: ', endIndex);
  // [numberOfLines, endIndex, fileSize, history]
  return Promise.all([
    fileReader.getLineCount(filePath, endIndex),
    endIndex,
    fileSize,
    fileReader.readNLastLines(filePath, 10, endIndex)
  ]);
};

const sendFileOpened = async (
  sender,
  filePath,
  lineCount,
  endIndex,
  fileSize,
  history
) => {
  const action = {
    type: 'SOURCE_OPENED',
    data: {
      sourceType: 'FILE',
      filePath,
      lineCount,
      endIndex,
      fileSize,
      history
    }
  };

  sender.send(ipcChannel, action);
};

const openFile = async (sender, filePath) => {
  const fileInfo = await getFileInfo(filePath).catch(e => {
    console.log(e);
    sendError(sender, "Couldn't open file")(e);
  });

  if (!fileInfo) return;
  sendFileOpened(sender, filePath, ...fileInfo);
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

      sendError(sender, "Couldn't load previous state from disk")(error);
    });
};

const handleFollowSource = (sender, { sourceType, ...rest }) => {
  switch (sourceType) {
    case 'FILE':
      handleFollowFile(sender, rest);
      break;
    default:
      sendError(sender, 'Unknown source type')({ code: 'CUSTOM' });
  }
};

const handleFollowFile = (sender, { filePath, fromIndex }) => {
  const onChange = lines => {
    const action = {
      type: 'LINES_NEW',
      data: {
        sourcePath: filePath,
        lines
      }
    };

    sender.send(ipcChannel, action);
  };

  const onError = sendError(sender, "Couldn't keep following source");

  fileReader.followFile(filePath, fromIndex, onChange, onError);
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

const sendError = (sender, message) => {
  return error => {
    const action = {
      type: 'ERROR',
      data: {
        message,
        error
      }
    };

    sender.send(ipcChannel, action);
  };
};

module.exports = {
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};

const menu = require('../electron/menu');
