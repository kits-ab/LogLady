const { ipcRenderer } = window.require('electron');

export const getLastLines = argObj => {
  console.log('Sending "getLastLines" over IPC', argObj);
  ipcRenderer.send('getLastLines', argObj);
};
