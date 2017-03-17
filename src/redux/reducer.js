import { combineReducers } from 'redux';
import supplyChain from './modules/supplyChain';
import auth from './modules/auth';
import ninePic from './modules/ninePic';
import appPushMsg from './modules/appPushMsg';
import activity from './modules/activity';
import operations from './modules/operations';
import statistics from './modules/statistics';
import mproducts from './modules/products';

const reducer = combineReducers({
  ...supplyChain,
  ...auth,
  ...ninePic,
  ...appPushMsg,
  ...activity,
  ...operations,
  ...statistics,
  ...mproducts,
});

export default reducer;
