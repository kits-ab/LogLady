const initialState = {
  index: 0,
  show: false,
  message: '',
  level: 'info'
};

const nextIndex = index => {
  return index + 1;
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
        index: nextIndex(state.index)
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
