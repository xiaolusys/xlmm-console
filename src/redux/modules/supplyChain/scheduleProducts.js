import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const initialState = {
  items: [],
  count: 0,
};

const name = 'SCHEDULE_PRODUCTS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    count: payload.data.count,
    items: payload.data.results,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`ADD_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`UPDATE_PRODUCT_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`UPDATE_POSITION_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`UPDATE_ASSIGNED_WORKER_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`DELETE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchProducts = (scheduleId, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/product`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const addProduct = (scheduleId, productIds, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/create_manage_detail`,
  method: 'post',
  type: `ADD_${name}`,
  data: {
    modelProductId: productIds,
  },
  success: (resp, dispatch) => {
    dispatch(fetchProducts(scheduleId, filters));
  },
});

export const updateProduct = (scheduleId, productId, params, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/modify_manage_detail/${productId}`,
  method: 'patch',
  type: `UPDATE_PRODUCT_${name}`,
  data: {
    ...params,
  },
  success: (resp, dispatch) => {
    dispatch(fetchProducts(scheduleId, filters));
  },
});

export const updatePosition = (scheduleId, productId, params, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/adjust_order_weight/${productId}`,
  method: 'patch',
  type: `UPDATE_POSITION_${name}`,
  data: {
    ...params,
  },
  success: (resp, dispatch) => {
    dispatch(fetchProducts(scheduleId, filters));
  },
});

export const updateAssignedWorker = (scheduleId, params, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/update_assign_worker`,
  method: 'post',
  type: `UPDATE_ASSIGNED_WORKER_${name}`,
  data: {
    ...params,
  },
  success: (resp, dispatch) => {
    dispatch(fetchProducts(scheduleId, filters));
  },
});

export const deleteProduct = (scheduleId, productId, filters) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}/product/${productId}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchProducts(scheduleId, filters));
  },
});
