const initialState = { openSources: [] };

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENU_CLEAR':
      return { ...state, openSources: [] };

    case 'MENU_SET_SOURCE':
      const { filePath } = action.data;
      return { ...state, openSources: [filePath] };
    case 'menuReducerRestore':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
