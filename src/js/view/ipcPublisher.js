const { ipcRenderer } = window.require('electron');

export const getLastLines = argObj => {
  console.log('Sending "getLastLines" over IPC', argObj);
  ipcRenderer.send('getLastLines', argObj);
};

export const getFileSize = argObj => {
  console.log('Sending "getFileSize" ocer IPC', argObj);
  ipcRenderer.send('getFileSize', argObj);
};
