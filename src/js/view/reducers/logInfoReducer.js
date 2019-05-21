const initialState = { numberOfLines: 0, fileSize: 0 };

export const logInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'numberOfLines':
      return {
        ...state,
        numberOfLines: action.data
      };
    case 'fileSize':
      return {
        ...state,
        fileSize: action.data
      };
    default:
      return state;
  }
};
