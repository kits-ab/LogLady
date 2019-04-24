const { Menu } = require('electron');
const { dialog } = require('electron');

const handleMenuItemClicked = _ipc => {
  return (type, data) => {
    _ipc.send('filePath', data);
    _ipc.send('backendMessages', { type: `menu_${type}`, data: data });
  };
};

const createMenu = ipc => {
  const menuItemClicked = handleMenuItemClicked(ipc);
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
            dialog.showOpenDialog(
              {
                properties: ['openFile']
              },
              filePath => {
                if (filePath === undefined) return;
                menuItemClicked('open', filePath);
              }
            );
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

module.exports = { createMenu: createMenu };
