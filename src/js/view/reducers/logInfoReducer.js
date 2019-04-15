export const logInfoReducer = (state = {}, action) => {
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
