import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  delivery: {},
  sales: {},
};

const apiBase = '/apis/daystats/category/';

const names = {
  delivery: 'DELIVERY',
  sales: 'SALES',
};

export default createReducer({
  [`FETCH_${names.delivery}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.delivery}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    delivery: payload.data,
  }),
  [`FETCH_${names.delivery}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.sales}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${names.sales}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    sales: payload.data,
  }),
  [`FETCH_${names.sales}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchDeliveryStats = (startDate, endDate) => ({
  url: `${apiBase}delivery_stats`,
  method: 'get',
  type: `FETCH_${names.delivery}`,
  params: {
    startDate: startDate,
    endDate: endDate,
  },
});

export const fetchSaleStats = (startDate, endDate) => ({
  url: `${apiBase}skusale_stats`,
  method: 'get',
  type: `FETCH_${names.sales}`,
  params: {
    startDate: startDate,
    endDate: endDate,
  },
});

