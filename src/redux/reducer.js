import { combineReducers } from 'redux';
import supplyChain from './modules/supplyChain';
import auth from './modules/auth';
import ninePic from './modules/ninePic';

const reducer = combineReducers({
  ...supplyChain,
  ...auth,
  ...ninePic,
});

export default reducer;
