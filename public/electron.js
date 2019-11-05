const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const updater = require('electron-simple-updater');
const engine = require('../src/js/engine/engine');
const menu = require('../src/js/electron/menu');
const appConfig = require('electron-settings');

updater.init();
engine.start();

console.log(updater.version);

let mainWindow, hiddenBackgroundWindow;

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

const createWindow = async () => {
  const mainWindowStateKeeper = windowStateKeeper('main');
  const windowOptions = {
    x: mainWindowStateKeeper.x,
    y: mainWindowStateKeeper.y,
    width: mainWindowStateKeeper.width,
    height: mainWindowStateKeeper.height,
    minWidth: 575,
    minHeight: 145,
    darkTheme: true,
    webPreferences: {
      devTools: isDev ? true : false,
      preload: path.join(__dirname, '..', '/src/js/view/preload.js')
    },
    icon: path.join(__dirname, './icons/png/256x256.png'),
    show: false
  };

  const loadWindowOptions = {
    ...windowOptions,
    frame: false,
    transparent: true,
    resizable: false
  };

  let loadingWindow = new BrowserWindow(loadWindowOptions);

  hiddenBackgroundWindow = new BrowserWindow(loadWindowOptions);

  mainWindow = new BrowserWindow(windowOptions);
  mainWindowStateKeeper.track(mainWindow);

  loadingWindow.once('show', () => {
    mainWindow.once('ready-to-show', () => {
      loadingWindow.hide();
      mainWindow.show(true);
      loadingWindow.close();
    });
    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    );
  });
  loadingWindow.loadFile(
    path.join(__dirname, '../src/resources/loadingSpinner.html')
  );
  hiddenBackgroundWindow.loadFile(
    path.join(__dirname, '..', '/src/resources/hiddenWindow.html')
  );

  mainWindow.on('close', () => {
    const argObj = { type: 'QUIT' };
    mainWindow.webContents.send('backendMessages', argObj);
  });
  loadingWindow.show();

  mainWindow.on('closed', () => {
    mainWindow = null;
    quitApplication();
  });
  mainWindow.webContents.openDevTools();
  menu.setWebContents(mainWindow.webContents);
};

// Forward hiddenWindowMessages to the window that didn't send it
ipcMain.on('hiddenWindowMessages', (event, args) => {
  if (event.sender === hiddenBackgroundWindow.webContents) {
    mainWindow.webContents.send('hiddenWindowMessages', args);
  } else if (event.sender === mainWindow.webContents) {
    hiddenBackgroundWindow.webContents.send('hiddenWindowMessages', args);
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

const quitApplication = () => {
  // if (process.platform !== 'darwin') {
  app.quit();
  // }
};

module.exports = {
  quitApplication
};
