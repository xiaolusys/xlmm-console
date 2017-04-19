import createReducer from 'redux/createReducer';
import { apiBase } from 'constants';

const initialState = {
  wareBy: [],
  sysStatus: [],
  logisticsCompany: [],
};

const name = 'PACKAGEORDER_FILTER';

export default createReducer({


  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchPackageOrderFilters = (filters) => ({
  url: '/trades/package_order/list_filters?format=json',
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});
