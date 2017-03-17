import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { fetchSku } from 'redux/modules/products/sku';

const initialState = {
};

const name = 'PRODUCT';

export default createReducer({
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`CREATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`UPDATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
}, initialState);

export const createProduct = (params) => ({
  url: `${apisBase.item}stock_product`,
  method: 'post',
  type: `CREATE_${name}`,
  data: {
    ...params,
  },
});

export const updateProduct = (productId, params) => ({
  url: `${apisBase.item}stock_product/${productId}`,
  method: 'put',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

export const fetchProduct = (id) => ({
  url: `${apisBase.item}stock_product/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const resetProduct = () => ({
  type: `RESET_${name}`,
});
