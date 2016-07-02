import { combineReducers } from 'redux';
import { schedules, schedule } from './modules/schedule';
import { suppliers, supplierFilters } from './modules/supplier';


const reducer = combineReducers({
  schedules,
  schedule,
  suppliers,
  supplierFilters,
});

export default reducer;
