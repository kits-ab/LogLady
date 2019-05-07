const { Menu } = require('electron');
const { dialog } = require('electron');

let webContents;

const handleMenuItemClicked = (type, data) => {
  webContents.send('backendMessages', { type: `menu_${type}`, data: data });
};

const handleShowOpenDialog = () => {
  dialog.showOpenDialog(
    {
      properties: ['openFile']
    },
    filePath => {
      if (filePath === undefined) return;
      handleMenuItemClicked('open', filePath);
      handleRecentFiles(filePath[0]);
    }
  );
};

let recentFilesObject = [];
const handleRecentFiles = filePath => {
  recentFilesObject = recentFilesObject.filter(file => {
    return file !== filePath;
  });
  recentFilesObject.unshift(filePath);
  if (recentFilesObject.length > 3) {
    recentFilesObject.pop();
  }
  createMenu();
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
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.reload();
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator:
            process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        },
        {
          type: 'separator'
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
  Menu.setApplicationMenu(createTemplate());
};

module.exports = {
  handleShowOpenDialog,
  setWebContents,
  createMenu
};
