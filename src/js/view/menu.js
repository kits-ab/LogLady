const { Menu } = require('electron');
const { dialog } = require('electron');
const { EventEmitter } = require('events');
const menuEvents = new EventEmitter();

const createMenu = () => {
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
                menuEvents.emit('filePath', filePath);
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

module.exports = {
  createMenu: createMenu,
  menuEvents: menuEvents
};
