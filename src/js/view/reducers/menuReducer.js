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

const findNextSourceHandle = (index, state) => {
  let indexAsInt = parseInt(index);
  // Check if we are closing the currently active tab
  if (indexAsInt === state.currentSourceHandle) {
    // If so, set new active tab
    let sourceIndexes = Object.keys(state.openSources);

    if (sourceIndexes[sourceIndexes.length - 1] === index) {
      // If closing tab is the last tab, set focus to next to last tab
      return parseInt(sourceIndexes[sourceIndexes.length - 2]);
    } else {
      // Otherwise, focus next tab in order
      return parseInt(sourceIndexes[sourceIndexes.indexOf(index) + 1]);
    }
  } else {
    // We did not close currently active tab, do not switch current source
    return state.currentSourceHandle;
  }
};

export const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MENU_CLEAR':
      return { ...state, openSources: {}, currentSourceHandle: undefined };

    case 'MENU_CLEAR_ITEM': {
      const { sourcePath } = action.data;
      const sourcesToKeep = {};
      let newSourceHandle = undefined;

      Object.keys(state.openSources).forEach(sourceIndex => {
        let sourceObject = state.openSources[sourceIndex];
        if (sourceObject.path !== sourcePath) {
          sourcesToKeep[sourceIndex] = sourceObject;
        } else {
          // Update sourcehandle in case we are closing currently active tab
          newSourceHandle = findNextSourceHandle(sourceIndex, state);
        }
      });

      return {
        ...state,
        openSources: {
          ...sourcesToKeep
        },
        currentSourceHandle: newSourceHandle
      };
    }
    case 'MENU_SET_SOURCE':
      const { sourcePath } = action.data;
      const index = state.nextIndex;
      const source = { path: sourcePath, index };
      const sourcesToKeep = {};

      Object.keys(state.openSources).forEach(sourceIndex => {
        let sourceObject = state.openSources[sourceIndex];
        if (sourceObject.path !== sourcePath) {
          sourcesToKeep[sourceIndex] = sourceObject;
        }
      });

      return {
        ...state,
        openSources: { ...sourcesToKeep, [index]: source },
        currentSourceHandle: index,
        nextIndex: nextIndex(index)
      };

    case 'MENU_STATE_RESTORE':
      return isValidState(action.data) ? { ...action.data } : initialState;
    case 'UPDATE_CURRENT_SOURCE_HANDLE':
      console.log("state", state)
      const { newSourceHandle } = action.data;
      return {
        ...state,
        currentSourceHandle: newSourceHandle
      };
    default:
      return state;
  }
};

export const getCurrentSource = state => {
  return state.openSources[state.currentSourceHandle];
};
