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
    case 'topPanelReducerRestore':
      return { ...action.data };
    default:
      return state;
  }
};
