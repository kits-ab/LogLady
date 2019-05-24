const { Menu, ipcMain, shell } = require('electron');
const engine = require('../engine/engine');
const isDev = require('electron-is-dev');

let webContents;
let recentFilesObject = [];

const handleShowOpenDialog = () => {
  ipcMain.emit(
    'frontendMessages',
    { sender: webContents },
    { function: 'DIALOG_OPEN_SHOW' }
  );
};

const handleOpenFile = filePath => {
  ipcMain.emit(
    'frontendMessages',
    { sender: webContents },
    { function: 'FILE_OPEN', data: { filePath } }
  );
};

const handleRecentFiles = filePath => {
  recentFilesObject = recentFilesObject.filter(file => {
    return file !== filePath;
  });
  recentFilesObject.unshift(filePath);
  if (recentFilesObject.length > 3) {
    recentFilesObject.pop();
  }
  engine.saveRecentFilesToDisk(JSON.stringify(recentFilesObject));
  createMenu();
};

const setRecentFiles = _recentFiles => {
  recentFilesObject = JSON.parse(_recentFiles);
};

const getRecentFiles = () => {
  return recentFilesObject;
};

const createTemplate = () => {
  const template = [
    {
      label: 'LogLady',
      submenu: [
        {
          label: 'Quit LogLady',
          role: 'quit'
        }
      ]
    },
    {
      label: 'File',
      submenu: [
        {
          label: 'Open file...',
          accelerator: 'CmdOrCtrl+O',
          click() {
            handleShowOpenDialog();
          }
        },
        {
          label: 'Open recent...',
          submenu: getRecentFiles().map(file => {
            return {
              label: file,
              click() {
                handleOpenFile(file);
              }
            };
          })
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        isDev
          ? {
              role: 'reload'
            }
          : {
              role: 'reload',
              visible: false,
              enabled: false
            },
        isDev
          ? {
              role: 'toggleDevTools'
            }
          : {
              role: 'toggleDevTools',
              visible: false
            },
        {
          role: 'resetzoom'
        },
        {
          role: 'zoomin'
        },
        {
          role: 'zoomout'
        },
        {
          type: 'separator'
        },
        {
          role: 'togglefullscreen'
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        {
          role: 'minimize'
        },
        {
          role: 'close'
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://kits.se/om/akarkhatab');
          }
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
};

const setWebContents = _webContents => {
  webContents = _webContents;
};

const createMenu = () => {
  Menu.setApplicationMenu(createTemplate());
};

module.exports = {
  handleShowOpenDialog,
  setWebContents,
  setRecentFiles,
  createMenu,
  handleRecentFiles
};
