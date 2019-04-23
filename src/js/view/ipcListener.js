import { sendRequestToBackend } from './ipcPublisher';
const { ipcRenderer } = window.require('electron');

export const ipcListener = (dispatch, state) => {
  ipcRenderer.on('backendMessages', (event, action) => {
    // console.log('in listener', action.data);

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

        argObj.function = 'liveLines';
        sendRequestToBackend(argObj);
        argObj.function = 'numberOfLines';
        sendRequestToBackend(argObj);
        argObj.function = 'fileSize';
        sendRequestToBackend(argObj);

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
