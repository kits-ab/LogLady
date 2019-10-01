const initialState = {
  nextIndex: 0,
  openSources: {},
  currentSourceHandle: undefined
};

const nextIndex = index => {
  return ~~index + 1;
};

const isValidOpenSource = (key, openSource) => {
  return (
    typeof openSource === 'object' &&
    typeof openSource.path === 'string' &&
    isValidIndex(openSource.index) &&
    key === openSource.index.toString()
  );
};

const isValidOpenSources = openSources => {
  if (!openSources) return false;

  let keys = Object.keys(openSources);
  return (
    typeof openSources === 'object' &&
    keys.filter(key => {
      return isValidOpenSource(key, openSources[key]);
    }).length === keys.length
  );
};

const isValidCurrentSourceHandle = currentSourceHandle => {
  return (
    currentSourceHandle === Math.floor(currentSourceHandle) ||
    currentSourceHandle === undefined
  );
};

const isValidIndex = index => {
  return typeof index === 'number' && index === Math.floor(index);
};

const isValidNextIndex = (index, openSources) => {
  return (
    index >
    Object.keys(openSources).reduce((max, i) => {
      return Math.max(max, i);
    }, Number.NEGATIVE_INFINITY)
  );
};

export const isValidState = state => {
  return (
    state &&
    typeof state === 'object' &&
    isValidOpenSources(state.openSources) &&
    isValidCurrentSourceHandle(state.currentSourceHandle) &&
    isValidIndex(state.nextIndex) &&
    isValidNextIndex(state.nextIndex, state.openSources)
  );
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

    case 'MENU_STATE_RESTORE':
      return isValidState(action.data) ? { ...action.data } : initialState;
    default:
      return state;
  }
};

export const getCurrentSource = state => {
  return state.openSources[state.currentSourceHandle];
};
