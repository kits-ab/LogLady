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
    });
};

const getNumberOfLines = (event, _argObj) => {
  fileReader.getNumberOfLines(_argObj.filePath).then(lines => {
    action.type = 'numberOfLines';
    action.data = lines;
    event.sender.send('backendMessages', action);
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
      event.sender.send('error', err);
    });
};

const stopWatcher = (event, _argObj) => {
  fileReader.stopWatcher(_argObj.filePath);
};

ipcMain.on('frontendMessages', (event, _argObj) => {
  switch (_argObj.function) {
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
    default:
  }
});
