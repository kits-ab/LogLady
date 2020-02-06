const initialTabState = {
  showSettings: false,
  highlightColor: 'red',
  wrapLineOn: false
};

const initialState = {
  tabSettings: {}
};

export const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'showSettings': {
      const { sourcePath } = action.data;

      return {
        tabSettings: {
          ...state.tabSettings,
          [sourcePath]: {
            ...state.tabSettings[sourcePath],
            showSettings: !state.tabSettings[sourcePath].showSettings
          }
        }
      };
    }
    case 'highlightColor': {
      const { sourcePath } = action.data;

      return {
        tabSettings: {
          ...state.tabSettings,
          [sourcePath]: {
            ...state.tabSettings[sourcePath],
            highlightColor: action.data.color
          }
        }
      };
    }
    case 'SETTINGS_STATE_RESTORE':
      return { ...action.data };
    case 'wrapLineOn': {
      const { sourcePath } = action.data;

      return {
        tabSettings: {
          ...state.tabSettings,
          [sourcePath]: {
            ...state.tabSettings[sourcePath],
            wrapLineOn: !state.tabSettings[sourcePath].wrapLineOn
          }
        }
      };
    }
    case 'CREATE_SETTINGS_OBJECT': {
      const { sourcePath } = action.data;

      return {
        tabSettings: {
          ...state.tabSettings,
          [sourcePath]: initialTabState
        }
      };
    }
    default:
      return state;
  }
};
