const { ipcRenderer } = window.require('electron');

export const ipcListener = dispatch => {
  ipcRenderer.on('app_store', (event, action) => {
    switch (action.type) {
      default:
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
    }
  });
};
