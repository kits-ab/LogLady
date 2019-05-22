const initialState = { show: false, message: '', level: 'info', fadeAfter: 0 };

export const snackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SNACKBAR_SHOW_NEW':
      const { message, level, fadeAfter } = action.data;
      return {
        ...state,
        show: true,
        message: message,
        level: level ? level : initialState.level,
        fadeAfter: fadeAfter ? fadeAfter : initialState.fadeAfter
      };
    case 'SNACKBAR_HIDE':
      const { instant } = action.data;
      return {
        ...state,
        show: false,
        fadeAfter: instant ? 0 : state.fadeAfter
      };
    default:
      return state;
  }
};
