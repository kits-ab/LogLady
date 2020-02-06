const initialTabState = {
  tailSwitch: true,
  highlightInput: '',
  filterInput: ''
};

const initialState = {
  settings: {}
};

export const topPanelReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'tailSwitch': {
      /*return {
        ...state,
        tailSwitch: !state.tailSwitch
      };*/
      const { sourcePath } = action.data;

      return {
        settings: {
          ...state.settings,
          [sourcePath]: {
            ...state.settings[sourcePath],
            tailSwitch: !state.settings[sourcePath].tailSwitch
          }
        }
      };
    }
    case 'filterInput': {
      /*return {
        ...state,
        filterInput: action.data
      };*/
      const { sourcePath } = action.data;

      return {
        settings: {
          ...state.settings,
          [sourcePath]: {
            ...state.settings[sourcePath],
            filterInput: action.data.text
          }
        }
      };
    }
    case 'highlightInput': {
      /*return {
        ...state,
        highlightInput: action.data
      };*/
      const { sourcePath } = action.data;

      return {
        settings: {
          ...state.settings,
          [sourcePath]: {
            ...state.settings[sourcePath],
            highlightInput: action.data.text
          }
        }
      };
    }
    case 'CREATE_SETTINGS_OBJECT': {
      console.log('creating object');
      const { sourcePath } = action.data;
      return {
        settings: {
          ...state.settings,
          [sourcePath]: initialTabState
        }
      };
    }
    case 'TOP_PANEL_STATE_RESTORE':
      return { ...initialState, ...action.data };
    default:
      return state;
  }
};
