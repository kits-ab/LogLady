const { Menu, ipcMain, shell } = require('electron');
const isDev = require('electron-is-dev');

let webContents;

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

const createTemplate = recentFiles => {
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
          submenu: recentFiles.map(file => {
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
      label: 'Edit',
      submenu: [
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
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

const createMenu = recentFiles => {
  Menu.setApplicationMenu(createTemplate(recentFiles));
};

module.exports = {
  handleShowOpenDialog,
  setWebContents,
  createMenu
};
