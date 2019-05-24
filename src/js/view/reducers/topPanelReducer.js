const initialState = {
  tailSwitch: true,
  highlightInput: '',
  filterInput: ''
};

export const topPanelReducer = (state = initialState, action) => {
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
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
