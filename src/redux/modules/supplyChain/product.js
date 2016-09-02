import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {};

const name = 'PRODUCT';

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
  [`CRAWL_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`CRAWL_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    title: payload.data.title,
    picUrl: payload.data.picUrl,
    productLink: payload.data.fetchUrl,
    supplierId: payload.data.saleSupplier,
    categoryId: payload.data.saleCategory,
  }),
  [`CRAWL_${name}_FAILURE`]: (state, { payload, status }) => ({
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
