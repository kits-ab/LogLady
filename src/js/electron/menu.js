const { Menu } = require('electron');
const { dialog } = require('electron');
const { setIpc, handleShowOpenDialog } = require('./handleFilePaths');

// let ipc;

// const setIpc = _ipc => {
//   ipc = _ipc;
// };

// const handleMenuItemClicked = (type, data) => {
//   ipc.send('backendMessages', { type: `menu_${type}`, data: data });
// };

// // bryt ut handleShowOpenDialog till egen fil
// // gör function av recentFilePaths och exportera den också
// // borde kunna komma åt den i electron.js då...
// const recentFilePaths = [];
// const handleShowOpenDialog = () => {
//   dialog.showOpenDialog(
//     {
//       properties: ['openFile']
//     },
//     filePath => {
//       if (filePath === undefined) return;
//       handleMenuItemClicked('open', filePath);
//       recentFilePaths.push(filePath);
//       console.log('recent files', recentFilePaths);
//     }
//   );
// };

const createMenu = (ipc, recentFilePaths) => {
  // const menuItemClicked = handleMenuItemClicked(ipc);
  setIpc(ipc);
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

module.exports = {
  createMenu: createMenu,
  handleShowOpenDialog: handleShowOpenDialog
};
