import { combineReducers } from 'redux';
import schedules from './modules/supplyChain/schedules';
import schedule from './modules/supplyChain/schedule';
import suppliers from './modules/supplyChain/suppliers';
import supplierFilters from './modules/supplyChain/supplierFilters';
import scheduleProducts from './modules/supplyChain/scheduleProducts';
import products from './modules/supplyChain/products';

const reducer = combineReducers({
  schedules,
  schedule,
  suppliers,
  supplierFilters,
  scheduleProducts,
  products,
});

export default reducer;
