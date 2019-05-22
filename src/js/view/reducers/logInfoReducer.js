const initialState = { numberOfLines: 0, fileSize: 0 };

export const logInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGINFO_SET_NUMBER_OF_LINES':
      return {
        ...state,
        numberOfLines: action.data
      };
    case 'LOGINFO_SET_FILESIZE':
      return {
        ...state,
        fileSize: action.data
      };
    default:
      return state;
  }
};
