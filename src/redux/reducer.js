import { combineReducers } from 'redux';
import schedules from './modules/supplyChain/schedules';
import schedule from './modules/supplyChain/schedule';
import suppliers from './modules/supplyChain/suppliers';
import supplierFilters from './modules/supplyChain/supplierFilters';

const reducer = combineReducers({
  schedules,
  schedule,
  suppliers,
  supplierFilters,
});

export default reducer;
