import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { clearSource } from '../../actions/dispatchActions';

export const showOpenDialog = () => {
  sendRequestToBackend({ function: 'DIALOG_OPEN_SHOW' });
};

export const openFile = filePath => {
  sendRequestToBackend({
    function: 'FILE_OPEN',
    data: { filePath }
  });
};

export const closeFile = (dispatch, filePath) => {
  //send request to backend
  const argObjUnfollow = {
    function: 'SOURCE_UNFOLLOW',
    filePath
  };
  sendRequestToBackend(argObjUnfollow);

  const argObjOnTabClose = {
    function: 'ON_TAB_CLOSE',
    filePath
  };
  sendRequestToBackend(argObjOnTabClose);

  //handle related states on frontend
  clearSource(dispatch, filePath);
};
