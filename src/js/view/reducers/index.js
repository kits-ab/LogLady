import { menuReducer } from './menuReducer';
import { settingsReducer } from './settingsReducer';
import { combineReducers } from 'redux';

const reducers = combineReducers({
  menuReducer,
  settingsReducer
});

export default reducers;
