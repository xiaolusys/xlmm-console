import { combineReducers } from 'redux';
import schedule from './modules/schedule/schedule';

const reducer = combineReducers({
  schedule,
});

export default reducer;
