const { ipcRenderer } = window.require('electron');

export const ipcListener = dispatch => {
  ipcRenderer.on('app_store', (event, action) => {
    dispatch({
      type: action.type,
      data: action.data
    });
  });
};
