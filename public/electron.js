const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const updater = require('electron-simple-updater');
const { ipcMain } = require('electron');
const engine = require('../src/js/engine/engine');

ipcMain.on('asynchronous-message', (event, arg) => {
  // console.log('arg received in electron.js: ', arg);

  let argObjReply = {};
  switch (arg.functionToCall) {
    case 'getLastLines':
      getLastLines(arg.filePath, arg.numberOfLines)
        .then(lines => {
          argObjReply.functionThatReplied = 'getLastLines';
          argObjReply.returnValue = lines;
          event.sender.send('asynchronous-reply', argObjReply);

          //Just to demonstrate that our listener is live.
          //Change interval to 10000 if you use live reloading during development.
          //Or comment it our entirely.
          setInterval(() => {
            argObjReply.functionThatReplied = 'time';
            argObjReply.returnValue = Date.now();
            event.sender.send('asynchronous-reply', argObjReply);
          }, 1);
        })
        .catch(err => {
          argObjReply.functionThatReplied = 'error';
          argObjReply.returnValue = err;
          event.sender.send('asynchronous-reply', argObjReply);
        });
      break;
    case 'getNthLines':
      getNthLines(arg.filePath, arg.lineNumber, arg.numberOfLines)
        .then(lines => {
          argObjReply.functionThatReplied = 'getNthLines';
          argObjReply.returnValue = lines;
          event.sender.send('asynchronous-reply', argObjReply);
        })
        .catch(err => {
          argObjReply.functionThatReplied = 'error';
          argObjReply.returnValue = err;
          event.sender.send('asynchronous-reply', argObjReply);
        });
      break;
    case 'getNumberOfLines':
      getNumberOfLines(arg.filePath)
        .then(lines => {
          argObjReply.functionThatReplied = 'getNumberOfLines';
          argObjReply.returnValue = lines;
          event.sender.send('asynchronous-reply', argObjReply);
        })
        .catch(err => {
          argObjReply.functionThatReplied = 'error';
          argObjReply.returnValue = err;
          event.sender.send('asynchronous-reply', argObjReply);
        });
      break;
    default:
      return null;
  }
});
updater.init();

console.log(updater.version);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const getLastLines = (filePath, numberOfLines) => {
  return engine.readLines(filePath, numberOfLines);
};

const getNthLines = (filePath, lineNumber, numberOfLines) => {
  return engine.readNthLines(filePath, lineNumber, numberOfLines);
};
// getNthLines('src/resources/myLittleFile.txt', 10, 5).then(lines => {
//   console.log('Lines in electron.js...', JSON.stringify(lines, null, 2));
// });

const getNumberOfLines = _filePath => {
  return engine.getNumberOfLines(_filePath);
};
// getNumberOfLines('src/resources/myLittleFile.txt').then(lines => {
//   console.log('number of lines in electron.js: ', lines);
// });
