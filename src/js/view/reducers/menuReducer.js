export const menuReducer = (state = {}, action) => {
  switch (action.type) {
    case 'menu_open':
      return {
        ...state,
        openFiles:
          action.data !== 'clearOpenFiles'
            ? state.openFiles
              ? [...state.openFiles, action.data[0]]
              : [action.data[0]]
            : []
      };
    default:
      return state;
  }
};
