import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'PRODUCT';

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

export const fetchProduct = (filters) => ({
  url: `${apisBase.supply}saleproduct`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const crawlProduct = (supplierId, productLink) => ({
  url: `${apisBase.supply}saleproduct/fetch_platform_product`,
  method: 'get',
  type: `CRAWL_${name}`,
  params: {
    supplierId: supplierId,
    fetchUrl: productLink,
  },
});

export const saveProduct = (params) => ({
  url: `${apisBase.supply}saleproduct/fetch_platform_product`,
  method: 'post',
  type: `SAVE_${name}`,
  params: {
    ...params,
  },
});

export const updateProduct = (params) => ({
  url: `${apisBase.supply}saleproduct/fetch_platform_product`,
  method: 'patch',
  type: `UPDATE_${name}`,
  params: {
    ...params,
  },
});
