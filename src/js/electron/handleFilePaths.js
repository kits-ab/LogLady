const { dialog } = require('electron');

let ipc;

const setIpc = _ipc => {
  ipc = _ipc;
};

const handleMenuItemClicked = (type, data) => {
  ipc.send('backendMessages', { type: `menu_${type}`, data: data });
};

const handleShowOpenDialog = () => {
  dialog.showOpenDialog(
    {
      properties: ['openFile']
    },
    filePath => {
      if (filePath === undefined) return;
      handleMenuItemClicked('open', filePath);
      handleRecentFiles(filePath);
      //   recentFilePaths.push(filePath);
      //   console.log('recent files', recentFilePaths);
    }
  );
};

const recentFilesObject = [];
const handleRecentFiles = recentFiles => {
  recentFilesObject.push(recentFiles);
  console.log(recentFilesObject);
};

module.exports = {
  setIpc: setIpc,
  handleShowOpenDialog: handleShowOpenDialog
};
