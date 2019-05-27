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
      const currentSize = state.logSizes[sourcePath];
      const exists = state.logSizes[sourcePath];
      return exists
        ? {
            ...state,
            logSizes: {
              ...state.logSizes,
              [sourcePath]: currentSize + Math.max(size, 0)
            }
          }
        : state;
    }
    case 'LOGINFO_SET_SIZE': {
      const { size, sourcePath } = action.data;
      return {
        ...state,
        logSizes: { ...state.logSizes, [sourcePath]: size }
      };
    }
    default:
      return state;
  }
};
