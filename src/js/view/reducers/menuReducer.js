const initialState = { openSources: [] };

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
      return { ...state, openSources: [] };

    case 'MENU_SET_SOURCE':
      const { sourcePath } = action.data;
      return { ...state, openSources: [sourcePath] };
    case 'MENU_STATE_RESTORE':
      return isValidState(action.data)
        ? { openSources: action.data.openSources }
        : initialState;
    default:
      return state;
  }
};
