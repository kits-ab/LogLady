const { fork } = require('child_process');
const { EventEmitter } = require('events');
const fileReader = require('../adapters/fileReader');
const { ipcMain } = require('electron');

const events = new EventEmitter();

ipcMain.on('getTime', (event, time) => {
  setInterval(() => {
    let time = Date.now();
    event.sender.send('theTime', time);
  }, 1000);
});

ipcMain.once('getLastLines', (event, lastLines) => {
  fileReader
    .readLastLines(lastLines.filePath, lastLines.numberOfLines)
    .then(lines => {
      console.log(lines);
      event.sender.send('lastLines', lines);
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
      console.log(lines);
      event.sender.send('nthLines', lines);
    });
});

ipcMain.once('getNumberOfLines', (event, numberOfLines) => {
  fileReader.getNumberOfLines(numberOfLines.filePath).then(lines => {
    event.sender.send('numberOfLines', lines);
  });
});
