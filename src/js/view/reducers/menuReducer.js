const initialState = {
  nextIndex: 0,
  openSources: {},
  currentSourceHandle: undefined
};

const nextIndex = index => {
  return ~~index + 1;
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENU_CLEAR':
      return { ...state, openSources: {}, currentSourceHandle: undefined };

    case 'MENU_SET_SOURCE':
      const { sourcePath } = action.data;
      const index = state.nextIndex;
      const source = { path: sourcePath, index };
      return {
        ...state,
        openSources: { [index]: source },
        currentSourceHandle: index,
        nextIndex: nextIndex(index)
      };

    case 'menuReducerRestore':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
