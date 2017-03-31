import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
  initial: true,
};


const name = 'SALEPRODUCTS';

export default createReducer({
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
      ...state,
      ...status,
      items: payload.data.results,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`GET_${name}_SUCCESS`]: (state, { payload, status }) => ({
      ...state,
      ...status,
      items: payload.data.results,
      initial: false,
  }),
}, initialState);

// export const fetchSaleProducts = (filters) => ({
//   url: `${apisBase.supply}saleproduct`,
//   method: 'get',
//   type: `FETCH_${name}`,
//   params: {
//     ...filters,
//   },
// });
export const getSaleProducts = (id) => ({
  url: `${apisBase.item}stock_product/${id}/get_sale_products`,
  method: 'get',
  type: `GET_${name}`,
});
export const saveSaleProducts = (params) => ({
  url: `${apisBase.supply}saleproduct/new_create`,
  method: 'post',
  type: `SAVE_${name}`,
  data: {
    ...params,
  },
});
export const updateSaleProducts = (id, params) => ({
  url: `${apisBase.supply}saleproduct/${id}/new_update  `,
  method: 'post',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

