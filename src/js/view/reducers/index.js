import { combineReducers } from 'redux';
import { logInfoReducer } from './logInfoReducer';
import { logViewerReducer } from './logViewerReducer';
import { menuReducer } from './menuReducer';
import { settingsReducer } from './settingsReducer';
import { topPanelReducer } from './topPanelReducer';
import { snackBarReducer } from './snackBarReducer';

const reducers = combineReducers({
  logInfoReducer,
  logViewerReducer,
  menuReducer,
  settingsReducer,
  topPanelReducer,
  snackBarReducer
});

export default reducers;
