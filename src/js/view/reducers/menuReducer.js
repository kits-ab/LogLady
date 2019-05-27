const initialState = {
  nextIndex: 0,
  openSources: [],
  currentSource: undefined
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENU_CLEAR':
      return { openSources: [], currentSource: undefined };

    case 'MENU_SET_SOURCE':
      const { sourcePath } = action.data;
      const source = { path: sourcePath, index: state.nextIndex++ };
      return {
        ...state,
        openSources: [source],
        currentSource: source // Using random for now, to create a unique index
      };

    case 'menuReducerRestore':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
