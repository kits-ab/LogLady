const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const updater = require('electron-simple-updater');
const { ipcMain } = require('electron');
const engine = require('../src/js/engine/engine');

ipcMain.on('asynchronous-message', (event, arg) => {
  console.log('arg: ', arg);
  getLines('src/resources/myLittleFile.txt', 5)
    .then(lines => {
      event.sender.send('asynchronous-reply', lines);
      setInterval(() => {
        event.sender.send('asynchronous-reply', Date.now());
      }, 1000);
    })
    .catch(err => {
      event.sender.send('asynchronous-reply', err);
    });
});

updater.init();

console.log(updater.version);

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    autoHideMenuBar: true,
    darkTheme: true
  });
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
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const getLines = (filePath, numberOfLines) => {
  return new Promise((resolve, reject) => {
    engine
      .readLines(filePath, numberOfLines)
      .then(lines => {
        console.log('inside getlines: ', lines);
        resolve(lines);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      });
  });
};
