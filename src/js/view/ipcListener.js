import { getLiveLines, getNumberOfLines, getFileSize } from './ipcPublisher';
const { ipcRenderer } = window.require('electron');

export const ipcListener = (dispatch, state) => {
  ipcRenderer.on('app_store', (event, action) => {
    switch (action.type) {
      case 'menu_open':
        dispatch({
          type: action.type,
          data: action.data
        });
        let argObj = {};
        argObj.filePath = action.data[0];
        argObj.numberOfLines = 5;
        argObj.lineNumber = 10;

        getLiveLines(argObj);
        getNumberOfLines(argObj);
        getFileSize(argObj);

        break;
      default:
        dispatch({
          type: action.type,
          data: action.data
        });
        break;
    }
  });
};
