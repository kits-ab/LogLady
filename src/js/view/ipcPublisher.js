export const sendRequestToBackend = _argObj => {
  window.ipcRenderer.send('frontendMessages', _argObj);
};
