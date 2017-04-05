import createReducer from 'redux/createReducer';
import { apiBase } from 'constants';

const initialState = {
  count: 0,
  items: [],
};

const name = 'PACKAGESKUITEMS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data.results,
    count: payload.data.count,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchPackageSkuItem = (filters) => ({
  url: '/trades/package_sku_item',
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});
