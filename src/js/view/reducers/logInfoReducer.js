const initialState = { numberOfLines: 0, logSizes: {} };

export const logInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGINFO_SET_NUMBER_OF_LINES':
      return {
        ...state,
        numberOfLines: action.data
      };
    case 'LOGINFO_INCREASE_SIZE': {
      const { size, sourcePath } = action.data;
      const logSizes = { ...state.logSizes };
      logSizes[sourcePath] += size;
      return {
        ...state,
        logSizes
      };
    }
    case 'LOGINFO_SET_SIZE': {
      const { size, sourcePath } = action.data;
      const logSizes = { ...state.logSizes };
      logSizes[sourcePath] = size;
      return {
        ...state,
        logSizes
      };
    }
    default:
      return state;
  }
};
