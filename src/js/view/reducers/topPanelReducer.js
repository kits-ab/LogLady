export const topPanelReducer = (state = { tailSwitch: true }, action) => {
  switch (action.type) {
    case 'tailSwitch':
      return {
        ...state,
        tailSwitch: !state.tailSwitch
      };
    default:
      return state;
  }
};
