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

// kolla så att samma filepath inte finns med 2 gånger
// finns filepathen med sen innan ta bort den gamla och lägga till den nya
// så att de hamnar i rätt ordning (den senaste ordningen de har öppnats)
// begränsa hur många element som kan finnas (tex max 10)
// lista ut hur man ska kunna få objektet till det sparade windowsatatet i electron.js

const recentFilesObject = [];
const handleRecentFiles = recentFiles => {
  recentFilesObject.push(recentFiles);
  // recentFilesObject.map((data, i) => {
  //   if (recentFilesObject.includes(data)) {
  //     // recentFilesObject.splice(i);
  //     recentFilesObject.push(recentFiles);
  //   }
  //   console.log(data);
  // });
  if (recentFilesObject.length > 10) {
    recentFilesObject.shift();
  }
  console.log(recentFilesObject);
};

module.exports = {
  setIpc: setIpc,
  handleShowOpenDialog: handleShowOpenDialog
};
