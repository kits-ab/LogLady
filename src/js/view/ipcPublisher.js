const { ipcRenderer } = window.require('electron');

export const getFileSize = argObj => {
  ipcRenderer.send('getFileSize', argObj);
};

export const getLiveLines = argObj => {
  ipcRenderer.send('getLiveLines', argObj);
};

export const getNthLines = argObj => {
  ipcRenderer.send('getNthLines', argObj);
};
export const getNumberOfLines = argObj => {
  ipcRenderer.send('getNumberOfLines', argObj);
};
