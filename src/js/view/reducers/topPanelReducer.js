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
    case 'highlightInput':
      return {
        ...state,
        highlightInput: action.data
      };
    default:
      return state;
  }
};
