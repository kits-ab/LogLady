const initialState = {
  nextIndex: 0,
  openSources: {},
  currentSourceHandle: undefined
};

const nextIndex = index => {
  return ~~index + 1;
};

export const isValidState = state => {
  if (
    state &&
    typeof state === 'object' &&
    state.openSources &&
    Array.isArray(state.openSources) &&
    state.openSources.filter(x => {
      return typeof x === 'string';
    }).length === state.openSources.length
  )
    return true;

  return false;
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
      return isValidState(action.data)
        ? { openSources: action.data.openSources }
        : initialState;
    default:
      return state;
  }
};
