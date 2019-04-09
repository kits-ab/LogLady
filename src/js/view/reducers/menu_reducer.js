export const menuReducer = (state = {}, action) => {
  switch (action.type) {
    case 'menu_open':
      const _newState = {
        ...state,
        openFiles: state.openFiles
          ? [...state.openFiles, action.data[0]]
          : [action.data[0]]
      };
      console.log(_newState);
      return _newState;
    default:
      return state;
  }
};
