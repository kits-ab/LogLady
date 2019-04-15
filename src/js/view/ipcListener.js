const { ipcRenderer } = window.require('electron');

export const ipcListener = dispatch => {
  ipcRenderer.on('app_store', (event, action) => {
    switch (action.type) {
      case 'liveLines':
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
      case 'nthLines':
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
      case 'numberOfLines':
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
      case 'fileSize':
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
      default:
    }
  });
};
