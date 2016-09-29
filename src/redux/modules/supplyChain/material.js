import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'MATERIAL';

export default createReducer({
  [`SAVE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`SAVE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`UPDATE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`UPDATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`UPDATE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`RESET_${name}`]: (state, { payload, status }) => ({

  }),
}, initialState);

export const saveMaterial = (params) => ({
  url: '/apis/items/v2/product',
  method: 'post',
  type: `SAVE_${name}`,
  data: {
    ...params,
  },
});

export const updateMaterial = (params) => ({
  url: '/apis/items/v2/product/update_product_details',
  method: 'patch',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

export const resetMaterial = () => ({
  type: `RESET_${name}`,
});
