const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');

let action = {};

const openFile = async (sender, { filePath }) => {
  try {
    let lines = await fileReader.readNLastLines(filePath, 10);
    sendLiveLinesToFrontend(sender, lines.slice(0, lines.lastIndexOf('\n')));
    fileReader.followFile(sender, filePath);
  } catch (err) {
    sendErrorToFrontend(sender, "Couldn't open file", err);
  }
};

const getNthLines = (sender, { filePath, lineNumber, numberOfLines }) => {
  fileReader
    .readNthLines(filePath, lineNumber, numberOfLines)
    .then(lines => {
      action.type = 'nthLines';
      action.data = lines;
      sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(sender, "Couldn't read nth lines", err);
    });
};

const getNumberOfLines = (sender, { filePath }) => {
  fileReader
    .getNumberOfLines(filePath)
    .then(lines => {
      action.type = 'numberOfLines';
      action.data = lines;
      sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(sender, "Couldn't read number of lines", err);
    });
};

const getFileSize = (sender, { filePath }) => {
  fileReader
    .getFileSizeInBytes(filePath)
    .then(size => {
      action.type = 'fileSize';
      action.data = size;
      sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(sender, "Couldn't read file size", err);
    });
};

const stopWatcher = ({ filePath }) => {
  fileReader.stopWatcher(filePath);
};

const loadStateFromDisk = sender => {
  fileReader
    .loadStateFromDisk()
    .then(_data => {
      if (JSON.parse(_data).menuReducer.openFiles.length < 1) {
        sendErrorToFrontend(sender, 'noReduxStateFile');
      } else {
        action.type = 'loadState';
        action.data = _data;
      }
      sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(
        sender,
        "Couldn't load previous state from disk",
        err
      );
    });
};

const sendErrorToFrontend = (sender, message, err) => {
  const action = {
    type: 'error',
    message: message,
    error: err
  };

  sender.send('backendMessages', action);
};

const sendLiveLinesToFrontend = (sender, lines) => {
  const action = {
    type: 'liveLines',
    data: lines
  };

  sender.send('backendMessages', action);
};

const saveRecentFilesToDisk = _recentFiles => {
  fileReader.saveRecentFilesToDisk(_recentFiles);
};

const loadRecentFilesFromDisk = () => {
  return fileReader.loadRecentFilesFromDisk();
};

ipcMain.on('frontendMessages', (event, _argObj) => {
  const sender = event.sender;
  switch (_argObj.function) {
    case 'liveLines':
      openFile(sender, _argObj);
      break;
    case 'numberOfLines':
      getNumberOfLines(sender, _argObj);
      break;
    case 'fileSize':
      getFileSize(sender, _argObj);
      break;
    case 'nthLines':
      getNthLines(sender, _argObj);
      break;
    case 'stopWatcher':
      stopWatcher(_argObj);
      break;
    case 'showOpenDialog':
      menu.handleShowOpenDialog();
      break;
    case 'saveState':
      fileReader.saveStateToDisk(_argObj.reduxStateValue);
      break;
    case 'loadState':
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
