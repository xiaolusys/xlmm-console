import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { fetchSku } from 'redux/modules/products/sku';

const initialState = {
};

const name = 'STOCKPRODUCT';

export default createReducer({
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
    firstLoadUpdate: true,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`CREATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
    lastUpdated: true,
    lastCreated: true,
  }),
  [`UPDATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
      ...state,
      ...status,
      ...payload.data,
      lastUpdated: true,
  }),
  [`CRAWL_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    crawl: true,
    title: payload.data.title,
    picUrl: payload.data.picUrl,
    productLink: payload.data.fetchUrl,
  }),
  [`RESET_${name}`]: (state, { payload, status }) => ({
    ...initialState,
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

export const crawlProduct = (productLink) => ({
  url: `${apisBase.supply}saleproduct/fetch_taobao_product`,
  method: 'get',
  type: `CRAWL_${name}`,
  params: {
    fetchUrl: productLink,
  },
});
