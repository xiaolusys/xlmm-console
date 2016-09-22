import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { fetchSku } from './sku';

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
    saleSupplier: payload.data.saleSupplier,
    supplierSku: payload.data.supplierSku,
  }),
  [`CRAWL_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`SAVE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`UPDATE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`UPDATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
    updated: true,
  }),
  [`UPDATE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`RESET_${name}`]: (state, { payload, status }) => ({

  }),
}, initialState);

export const fetchProduct = (id) => ({
  url: `${apisBase.supply}saleproduct/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
  success: (resolved, dispatch) => {
    const { saleCategory } = resolved.data;
    dispatch(fetchSku(saleCategory.id));
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
  url: `${apisBase.supply}saleproduct`,
  method: 'post',
  type: `SAVE_${name}`,
  data: {
    ...params,
  },
});

export const updateProduct = (id, params) => ({
  url: `${apisBase.supply}saleproduct/${id}`,
  method: 'patch',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

export const resetProduct = () => ({
  type: `RESET_${name}`,
});
