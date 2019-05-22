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

const sendSourceOpened = (
  sender,
  filePath,
  numberOfLines,
  fileSize,
  history
) => {
  const action = {
    type: 'SOURCE_OPENED',
    filePath,
    numberOfLines,
    fileSize,
    history
  };

  return sender.send(ipcChannel, action);
};

const handleFollowSource = (sender, filePath) => {
  const onChange = lines => {
    const action = {
      type: 'LINES_NEW',
      filePath,
      lines
    };

    sender.send(ipcChannel, action);
  };

  fileReader.followFile(filePath, onChange);
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
        type: 'STATE_LOAD',
        data: _data
      };

      sender.send(ipcChannel, action);
    })
    .catch(sendError(sender, "Couldn't load previous state from disk"));
};

const sendError = (sender, message) => {
  return err => {
    const action = {
      type: 'ERROR',
      message: message,
      error: err
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

  sendSourceOpened(sender, ...fileInfo);
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
      handleFollowSource(sender, _argObj.filePath);
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
