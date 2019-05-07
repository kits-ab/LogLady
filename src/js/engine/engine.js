const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');

let action = {};

const getLiveLines = (event, _argObj) => {
  fileReader.readLinesLive(_argObj.filePath);
  fileReader.fileReaderEvents.on('liveLines', lines => {
    action.type = 'liveLines';
    action.data = lines;
    event.sender.send('backendMessages', action);
  });
};

const getNthLines = (event, _argObj) => {
  fileReader
    .readNthLines(_argObj.filePath, _argObj.lineNumber, _argObj.numberOfLines)
    .then(lines => {
      action.type = 'nthLines';
      action.data = lines;
      event.sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(event, err);
    });
};

const getNumberOfLines = (event, _argObj) => {
  fileReader
    .getNumberOfLines(_argObj.filePath)
    .then(lines => {
      action.type = 'numberOfLines';
      action.data = lines;
      event.sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(event, err);
    });
};

const getFileSize = (event, _argObj) => {
  fileReader
    .getFileSizeInBytes(_argObj.filePath)
    .then(size => {
      action.type = 'fileSize';
      action.data = size;
      event.sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(event, err);
    });
};

const stopWatcher = (event, _argObj) => {
  fileReader.stopWatcher(_argObj.filePath);
};

const loadStateFromDisk = event => {
  fileReader
    .loadStateFromDisk()
    .then(_data => {
      action.type = 'loadState';
      action.data = _data;
      event.sender.send('backendMessages', action);
    })
    .catch(err => {
      sendErrorToFrontend(event, err);
    });
};

const sendErrorToFrontend = (event, err) => {
  action.type = 'backendError';
  action.data = err;
  event.sender.send('backendMessages', action);
};

const saveRecentFilesToDisk = _recentFiles => {
  console.log('inside engine.');
  fileReader.saveRecentFilesToDisk(_recentFiles);
};

const loadRecentFilesFromDisk = () => {
  return fileReader.loadRecentFilesFromDisk();
};

ipcMain.on('frontendMessages', (event, _argObj) => {
  switch (_argObj._function) {
    case 'liveLines':
      getLiveLines(event, _argObj);
      break;
    case 'numberOfLines':
      getNumberOfLines(event, _argObj);
      break;
    case 'fileSize':
      getFileSize(event, _argObj);
      break;
    case 'nthLines':
      getNthLines(event, _argObj);
      break;
    case 'stopWatcher':
      stopWatcher(event, _argObj);
      break;
    case 'showOpenDialog':
      menu.handleShowOpenDialog();
      break;
    case 'saveState':
      fileReader.saveStateToDisk(_argObj.reduxStateValue);
      break;
    case 'loadState':
      loadStateFromDisk(event);
      break;
    default:
  }
});

module.exports = {
  saveRecentFilesToDisk,
  loadRecentFilesFromDisk
};

const menu = require('../electron/menu');
