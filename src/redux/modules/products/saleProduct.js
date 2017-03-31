import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
};
const name = 'SALEPRODUCT';

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
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`UPDATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`SETMAIN_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    setMainSaleProduct: true,
  }),
}, initialState);

export const fetchSaleProduct = (id) => ({
  url: `${apisBase.supply}saleproduct/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const deleteSaleProduct = (id) => ({
  url: `${apisBase.supply}saleproduct/${id}`,
  method: 'delete',
  type: `FETCH_${name}`,
});

export const saveSaleProduct = (params) => ({
  url: `${apisBase.supply}saleproduct/new_create`,
  method: 'post',
  type: `SAVE_${name}`,
  data: {
    ...params,
  },
});

export const updateSaleProduct = (id, params) => ({
  url: `${apisBase.supply}saleproduct/${id}/new_update  `,
  method: 'post',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

export const setMainSaleProduct = (id) => ({
  url: `${apisBase.supply}saleproduct/${id}/set_main_sale_product  `,
  method: 'post',
  type: 'SETMAIN_${name}',
});
