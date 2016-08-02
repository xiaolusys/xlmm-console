import { combineReducers } from 'redux';
import supplyChain from './modules/supplyChain';
import auth from './modules/auth';

const reducer = combineReducers({
  ...supplyChain,
  ...auth,
});

export default reducer;
