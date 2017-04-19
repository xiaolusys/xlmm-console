import { combineReducers } from 'redux';
import supplyChain from './modules/supplyChain';
import auth from './modules/auth';
import ninePic from './modules/ninePic';
import appPushMsg from './modules/appPushMsg';
import activity from './modules/activity';
import operations from './modules/operations';
import statistics from './modules/statistics';
import mproducts from './modules/products';
import packageOrder from './modules/packageOrder';
import packageSkuItem from './modules/packageSkuItem';

const reducer = combineReducers({
  ...supplyChain,
  ...auth,
  ...ninePic,
  ...appPushMsg,
  ...activity,
  ...operations,
  ...statistics,
  ...mproducts,
  ...packageOrder,
  ...packageSkuItem,
});

export default reducer;
