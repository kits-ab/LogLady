const initialState = {
  showSettings: false,
  highlightColor: 'red',
  wrapLineOn: false
};
export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'showSettings':
      return {
        ...state,
        showSettings: !state.showSettings
      };
    case 'highlightColor':
      return {
        ...state,
        highlightColor: action.data
      };
    case 'wrapLineSetting':
      return {
        ...state,
        wrapLineOn: action.data
      };
    default:
      return state;
  }
};
