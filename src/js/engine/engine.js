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

ipcMain.on('getLastLines', (event, lastLines) => {
  fileReader
    .readLastLines(lastLines.filePath, lastLines.numberOfLines)
    .then(lines => {
      console.log(lines);
      event.sender.send('lastLines', lines);
    });
});

ipcMain.on('getNthLines', (event, nthLines) => {
  fileReader
    .readNthLines(
      nthLines.filePath,
      nthLines.lineNumber,
      nthLines.numberOfLines
    )
    .then(lines => {
      console.log(lines);
      event.sender.send('theLines', lines);
    });
});

ipcMain.on('getNumberOfLines', (event, nol) => {
  fileReader.getNumberOfLines(nol.filePath).then(lines => {
    event.sender.send('nol', lines);
  });
});
