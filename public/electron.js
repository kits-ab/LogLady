const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { autoUpdater } = require('electron-updater');
const engine = require('../src/js/engine/engine');
const menu = require('../src/js/electron/menu');
const appConfig = require('electron-settings');

engine.start();

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

const handleOnAppReady = () => {
  if (isDev) {
    // Install chrome extensions for React and Redux for the Electron windows, if developer
    // These are placed in the apps userData folder, remove the files there to remove the extensions

    // Require here as they are only needed in this scope, and to make sure they user is running as dev
    const {
      default: installChromeExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS
    } = require('electron-devtools-installer');

    const logPrefixedSuccessInstall = name => {
      console.log('electron-devtools-installer: Installed extension:', name);
    };

    const logPrefixedErrorOccured = err => {
      console.log('electron-devtools-installer: An error occured:', err);
    };

    installChromeExtension(REACT_DEVELOPER_TOOLS)
      .then(logPrefixedSuccessInstall)
      .catch(logPrefixedErrorOccured);

    installChromeExtension(REDUX_DEVTOOLS)
      .then(logPrefixedSuccessInstall)
      .catch(logPrefixedErrorOccured);
  } else {
    // Check for update from electron-updater, and notify if available
    autoUpdater.checkForUpdatesAndNotify();
  }

  createWindow();
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
    const argObj = { type: 'SAVE_CURRENT_STATE' };
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

app.on('ready', handleOnAppReady);

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
