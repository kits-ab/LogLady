import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { clearSources } from '../../actions/dispatchActions';

export const showOpenDialog = () => {
  sendRequestToBackend({ function: 'DIALOG_OPEN_SHOW' });
};

export const closeFile = (dispatch, filePath) => {
  //send request to backend
  const argObj = {
    function: 'SOURCE_UNFOLLOW',
    filePath
  };
  sendRequestToBackend(argObj);

  //handle related states on frontend
  clearSources(dispatch);
};
