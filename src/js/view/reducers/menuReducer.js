const initialState = { openSources: [] };

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'clearAllLogs':
      return { ...state, openSources: [] };

    case 'setLogSource':
      return { ...state, openSources: [action.filePath] };
    case 'menuReducerRestore':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
