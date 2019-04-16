const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');

let action = {};

ipcMain.on('getLiveLines', (event, argObj) => {
  fileReader.readLinesLive(argObj.filePath);
  fileReader.fileReaderEvents.on('liveLines', lines => {
    action.type = 'liveLines';
    action.data = lines;
    event.sender.send('app_store', action);
  });
});

ipcMain.once('getNthLines', (event, nthLines) => {
  fileReader
    .readNthLines(
      nthLines.filePath,
      nthLines.lineNumber,
      nthLines.numberOfLines
    )
    .then(lines => {
      action.type = 'nthLines';
      action.data = lines;
      event.sender.send('app_store', action);
    });
});

ipcMain.once('getNumberOfLines', (event, numberOfLines) => {
  fileReader.getNumberOfLines(numberOfLines.filePath).then(lines => {
    action.type = 'numberOfLines';
    action.data = lines;
    event.sender.send('app_store', action);
  });
});

ipcMain.once('getFileSize', (event, argObj) => {
  fileReader
    .getFileSizeInBytes(argObj.filePath)
    .then(size => {
      action.type = 'fileSize';
      action.data = size;
      event.sender.send('app_store', action);
    })
    .catch(err => {
      event.sender.send('error', err);
    });
});
