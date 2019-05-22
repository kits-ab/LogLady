const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const ipcChannel = 'backendMessages';

const getFileInfo = filePath => {
  // [filepath, numberOfLines, fileSize, history]
  return Promise.all([
    filePath,
    fileReader.getNumberOfLines(filePath),
    fileReader.getFileSizeInBytes(filePath),
    fileReader.readNLastLines(filePath, 10)
  ]);
};

const sendFileOpened = (
  sender,
  filePath,
  [lineCount, lastLineEndIndex],
  fileSize,
  history
) => {
  const action = {
    type: 'SOURCE_OPENED',
    data: {
      sourceType: 'FILE',
      filePath,
      lineCount,
      lastLineEndIndex,
      fileSize,
      history
    }
  };

  return sender.send(ipcChannel, action);
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

const loadStateFromDisk = sender => {
  fileReader
    .loadStateFromDisk()
    .then(_data => {
      const previousSource = JSON.parse(_data).menuReducer.openSources[0];

      if (previousSource) {
        openFile(sender, previousSource);
      }

      const action = {
        type: 'STATE_SET',
        data: _data
      };

      sender.send(ipcChannel, action);
    })
    .catch(sendError(sender, "Couldn't load previous state from disk"));
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

const saveRecentFilesToDisk = _recentFiles => {
  fileReader.saveRecentFilesToDisk(_recentFiles);
};

const loadRecentFilesFromDisk = () => {
  return fileReader.loadRecentFilesFromDisk();
};

const openFile = async (sender, filePath) => {
  const fileInfo = await getFileInfo(filePath).catch(
    sendError(sender, "Couldn't open file")
  );

  if (!fileInfo) return;

  sendFileOpened(sender, ...fileInfo);
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

module.exports = {
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};

const menu = require('../electron/menu');
