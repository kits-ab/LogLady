import { menuReducer } from './menuReducer';
import { settingsReducer } from './settingsReducer';
import { logInfoReducer } from './logInfoReducer';
import { topPanelReducer } from './topPanelReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  menuReducer,
  settingsReducer,
  logInfoReducer,
  topPanelReducer
});

export default reducers;
