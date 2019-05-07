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
      handleRecentFiles(filePath[0]);
      //   recentFilePaths.push(filePath);
      //   console.log('recent files', recentFilePaths);
    }
  );
};

// kolla så att samma filepath inte finns med 2 gånger
// finns filepathen med sen innan ta bort den gamla och lägga till den nya
// så att de hamnar i rätt ordning (den senaste ordningen de har öppnats)
// begränsa hur många element som kan finnas (tex max 10)
// lista ut hur man ska kunna få objektet till det sparade windowsatatet i electron.js

let recentFilesObject = [];
const handleRecentFiles = filePath => {
  recentFilesObject = recentFilesObject.filter(file => {
    return file !== filePath;
  });
  recentFilesObject.push(filePath);
  if (recentFilesObject.length > 3) {
    recentFilesObject.shift();
  }
  // console.log(recentFilesObject);
  // return recentFilesObject;
};

const getRecentFiles = () => {
  console.log('get recent files', recentFilesObject);

  return recentFilesObject;
};

module.exports = {
  setIpc,
  handleShowOpenDialog,
  getRecentFiles: getRecentFiles
};
