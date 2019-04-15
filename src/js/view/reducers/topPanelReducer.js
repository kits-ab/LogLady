export const topPanelReducer = (state = { tailSwitch: true }, action) => {
  switch (action.type) {
    case 'tailSwitch':
      return {
        ...state,
        tailSwitch: !state.tailSwitch
      };
    case 'filterInput':
      return {
        ...state,
        filterInput: action.data
      };
    default:
      return state;
  }
};
