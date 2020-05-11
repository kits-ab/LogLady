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
  const argObj = {
    function: 'SOURCE_UNFOLLOW',
    filePath
  };
  sendRequestToBackend(argObj);
  const argObj2 = {
    function: 'FLUSH_CACHE_FOR_FILE',
    filePath
  };
  sendRequestToBackend(argObj2);

  //handle related states on frontend
  clearSource(dispatch, filePath);
};
