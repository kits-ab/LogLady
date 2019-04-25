const initialState = {
  showSettings: false,
  highlightColor: 'red'
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
    default:
      return state;
  }
};
