export const settingsReducer = (state = {}, action) => {
  switch (action.type) {
    case 'showSettings':
      return {
        ...state,
        showSettings: !state.showSettings
      };
    default:
      return state;
  }
};
