const initialState = { show: false, message: '', level: 'info', fadeAfter: 0 };

export const snackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'snackbar_show_new':
      return {
        ...state,
        show: true,
        message: action.message,
        level: action.level ? action.level : initialState.level,
        fadeAfter: action.fadeAfter ? action.fadeAfter : initialState.fadeAfter
      };
    case 'snackbar_hide':
      return {
        ...state,
        show: false,
        fadeAfter: action.instant ? 0 : state.fadeAfter
      };
    default:
      return state;
  }
};
