import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'PRODUCTS';

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
  [`DELETE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchProducts = (filters) => ({
  url: `${apisBase.supply}saleproduct`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const deleteProduct = (id, filters) => ({
  url: `${apisBase.supply}saleproduct/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resolved, dispatch) => {
    dispatch(fetchProducts(filters));
  },
});

export const batchCreateProduct = (params) => ({
  url: `${apisBase.supply}saleproduct/batch_create`,
  method: 'post',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});
