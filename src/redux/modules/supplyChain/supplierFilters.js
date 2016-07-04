import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  categorys: [],
  supplierType: [],
  supplierZone: [],
};

const type = 'FETCH_SUPPLIERS_FILTERS';

export default createReducer({
  [`${type}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${type}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`${type}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchFilters = () => ({
  url: `${apisBase.supply}supplier/list_filters`,
  method: 'get',
  type: type,
});
