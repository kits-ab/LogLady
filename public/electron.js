const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const updater = require('electron-simple-updater');
const engine = require('../src/js/engine/engine');
const menu = require('../src/js/electron/menu');
const { Menu } = require('electron');
const appConfig = require('electron-settings');
updater.init();

console.log(updater.version);

let mainWindow;

const windowStateKeeper = windowName => {
  let window, windowState;
  const setBounds = () => {
    if (appConfig.has(`windowState.${windowName}`)) {
      windowState = appConfig.get(`windowState.${windowName}`);
      return;
    }
    windowState = {
      x: undefined,
      y: undefined,
      width: 1000,
      height: 800
    };
  };
  const saveState = () => {
    if (!windowState.isMaximized) {
      windowState = window.getBounds();
    }
    windowState.isMaximized = window.isMaximized();
    appConfig.set(`windowState.${windowName}`, windowState);
  };
  const track = win => {
    window = win;
    ['resize', 'move', 'close'].forEach(event => {
      win.on(event, saveState);
    });
  };
  setBounds();
  return {
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    isMaximized: windowState.isMaximized,
    track
  };
};

const createWindow = () => {
  const mainWindowStateKeeper = windowStateKeeper('main');
  const windowOptions = {
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    minWidth: 600,
    minHeight: 125,
    darkTheme: true
  };
  mainWindow = new BrowserWindow(windowOptions);
  mainWindowStateKeeper.track(mainWindow);
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  Menu.setApplicationMenu(menu.createMenu(mainWindow.webContents));
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
