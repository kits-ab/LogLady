import { menuReducer } from './menuReducer';
import { settingsReducer } from './settingsReducer';
import { logInfoReducer } from './logInfoReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  menuReducer,
  settingsReducer,
  logInfoReducer
});

export default reducers;
