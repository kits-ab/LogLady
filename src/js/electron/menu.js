const { Menu } = require('electron');
const { dialog } = require('electron');
const engine = require('../engine/engine');
const isDev = require('electron-is-dev');

let webContents;
let recentFilesObject = [];

const handleMenuItemClicked = (type, data) => {
  webContents.send('backendMessages', { type: `menu_${type}`, data: data });
};

const handleShowOpenDialog = () => {
  const filePaths = dialog.showOpenDialog({
    properties: ['openFile']
  });

  console.log(filePaths);

  if (filePaths === undefined) return;
  handleMenuItemClicked('open', filePaths);
  handleRecentFiles(filePaths[0]);
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
            return { label: file };
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
            require('electron').shell.openExternal(
              'https://kits.se/om/akarkhatab'
            );
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
  engine
    .loadRecentFilesFromDisk()
    .then(_recentFiles => {
      setRecentFiles(_recentFiles);
      Menu.setApplicationMenu(createTemplate());
    })
    .catch(err => {
      let action = {};
      action.type = 'error';
      action.data = err;
      webContents.send('backendMessages', action);
      Menu.setApplicationMenu(createTemplate());
    });
};

module.exports = {
  handleShowOpenDialog,
  setWebContents,
  createMenu
};
