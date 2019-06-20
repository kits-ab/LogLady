import { combineReducers } from 'redux';
import { logInfoReducer as logInfoState } from './logInfoReducer';
import { logViewerReducer as logViewerState } from './logViewerReducer';
import { menuReducer as menuState } from './menuReducer';
import { settingsReducer as settingsState } from './settingsReducer';
import { topPanelReducer as topPanelState } from './topPanelReducer';
import { snackBarReducer as snackBarState } from './snackBarReducer';

const reducers = combineReducers({
  logInfoState,
  logViewerState,
  menuState,
  settingsState,
  topPanelState,
  snackBarState
});

export default reducers;
