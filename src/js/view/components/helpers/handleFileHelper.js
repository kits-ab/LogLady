import { sendRequestToBackend } from '../../ipcPublisher';
import { handleCloseFile } from '../../actions/dispatchActions';

let argObj = {};

export const showOpenDialog = () => {
  argObj.function = 'showOpenDialog';
  sendRequestToBackend(argObj);
};

export const closeFile = (dispatch, _filePath) => {
  //send request to backend
  argObj.function = 'stopWatcher';
  argObj.filePath = _filePath;
  sendRequestToBackend(argObj);

  //handle related states on frontend
  handleCloseFile(dispatch);
};
