const initialState = { numberOfLines: 0, fileSizes: {} };

export const logInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGINFO_SET_NUMBER_OF_LINES':
      return {
        ...state,
        numberOfLines: action.data
      };
    case 'LOGINFO_SET_FILESIZE':
      const { fileSize, filePath } = action.data;
      const fileSizes = { ...state.fileSizes };
      fileSizes[filePath] = fileSize;
      return {
        ...state,
        fileSizes
      };
    default:
      return state;
  }
};
