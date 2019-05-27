const initialState = {
  index: 0,
  show: false,
  message: '',
  level: 'info'
};

export const snackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SNACKBAR_SHOW_NEW':
      const { message, level } = action.data;
      return {
        ...state,
        show: true,
        message: message,
        level: level ? level : initialState.level,
        index: state.index + 1
      };
    case 'SNACKBAR_HIDE':
      return {
        ...state,
        show: false
      };
    default:
      return state;
  }
};
