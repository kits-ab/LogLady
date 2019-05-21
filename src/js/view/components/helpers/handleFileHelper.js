import { sendRequestToBackend } from 'js/view/ipcPublisher';
import { clearSources } from '../../actions/dispatchActions';

export const showOpenDialog = () => {
  sendRequestToBackend({ function: 'showOpenDialog' });
};

export const closeFile = (dispatch, _filePath) => {
  //send request to backend
  const argObj = {
    function: 'unfollowSource',
    filePath: _filePath
  };
  sendRequestToBackend(argObj);

  //handle related states on frontend
  clearSources(dispatch);
};
