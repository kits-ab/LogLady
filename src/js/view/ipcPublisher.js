const { ipcRenderer } = window.require('electron');

export const sendRequestToBackend = _argObj => {
  ipcRenderer.send('frontendMessages', _argObj);
};
