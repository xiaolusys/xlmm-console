import { combineReducers } from 'redux';
import supplyChain from './modules/supplyChain';
import auth from './modules/auth';
import ninePic from './modules/ninePic';
import appPushMsg from './modules/appPushMsg';

const reducer = combineReducers({
  ...supplyChain,
  ...auth,
  ...ninePic,
  ...appPushMsg,
});

export default reducer;
