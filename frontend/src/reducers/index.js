import { combineReducers } from 'redux';
import modifyReducer from './modifyReducer';

const allReducers = combineReducers({
  idModif: modifyReducer,
});

export default allReducers;
