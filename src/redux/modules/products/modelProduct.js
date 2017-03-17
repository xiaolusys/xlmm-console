import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
};

const name = 'MODEL_PRODUCT';

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
  [`PICTURE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
}, initialState);

export const fetchModelProduct = (id) => ({
  url: `${apisBase.pay}v1/modelproduct/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const createModelProduct = (params) => ({
  url: `${apisBase.pay}v1/modelproduct`,
  method: 'post',
  type: `CREATE_${name}`,
  data: {
    ...params,
  },
});

export const updateModelProduct = (id, params) => ({
  url: `${apisBase.pay}v1/modelproduct/${id}`,
  method: 'put',
  type: `UPDATE_${name}`,
  data: {
    ...params,
  },
});

export const setPictures = (id, params) => ({
  url: `${apisBase.pay}v1/modelproduct/${id}/set_pictures`,
  method: 'post',
  type: `PICTURE_${name}`,
  data: {
    ...params,
  },
});
