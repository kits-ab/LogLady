const { Menu } = require('electron');
const { dialog } = require('electron');

const handleMenuItemClicked = _ipc => {
  return (type, data) => {
    console.log({ type, data });
    _ipc.send('filePath', data);
    _ipc.send('app_store', { type: `menu_${type}`, data: data });
  };
};

const createMenu = ipc => {
  const menuItemClicked = handleMenuItemClicked(ipc);
  const template = [
    {
      label: 'LogLady',
      submenu: [
        {
          label: 'About LogLady'
        },
        {
          label: 'Preferences',
          submenu: [
            {
              label: 'Settings'
            },
            {
              label: 'Keyborad shortcuts'
            }
          ]
        },
        {
          label: 'Quit LogLady',
          role: 'quit'
        }
      ]
    },
    {
      label: 'Log',
      submenu: [
        {
          label: 'Open...',
          click() {
            dialog.showOpenDialog(
              {
                properties: ['openFile', 'multiSelections']
              },
              filePath => {
                menuItemClicked('open', filePath);
              }
            );
          }
        },
        {
          label: 'Open recent'
        },
        {
          label: 'Save'
        },
        {
          label: 'Save as...'
        },
        {
          label: 'Find'
        },
        {
          label: 'Log-settings'
        },
        {
          label: 'Close log'
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {
          role: 'undo'
        },
        {
          role: 'redo'
        },
        {
          type: 'separator'
        },
        {
          role: 'cut'
        },
        {
          role: 'copy'
        },
        {
          role: 'paste'
        },
        {
          role: 'delete'
        },
        {
          role: 'selectall'
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
          label: 'Show minitail',
          type: 'checkbox',
          checked: true
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
