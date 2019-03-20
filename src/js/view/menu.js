const { Menu } = require('electron');
const { dialog } = require('electron');

const createMenu = () => {
  let killMe;
  const test = killMe => {
    console.log(killMe, '---->outside template');
  };
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
          label: 'Quit Loglady'
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
                console.log(filePath, '----> inside click()');
                killMe = filePath;
                test(killMe);
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
            require('electron').shell.openExternal('http://electron.atom.io');
          }
        }
      ]
    }
  ];

  return Menu.buildFromTemplate(template);
};

module.exports = {
  createMenu: createMenu
};
