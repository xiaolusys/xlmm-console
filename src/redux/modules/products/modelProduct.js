import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
};

const name = 'MODEL_PRODUCT';

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
  [`FETCH_${name}_HEADIMG_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_HEADIMG_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data[0],
  }),
  [`FETCH_${name}_HEADIMG_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`RESET_${name}_HEADIMG`]: (state, { payload, status }) => ({

  }),
  [`CREATE_${name}_SUCCESS`]: (state, { payload, status }) => ({
      ...state,
      ...status,
      created: true,
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

export const fetchModelProductHeadImg = (id) => ({
  url: `${apisBase.pay}v1/modelproduct/get_headimg?modelId=${id}`,
  method: 'get',
  type: `FETCH_${name}_HEADIMG`,
});

export const resetModelProductHeadImg = () => ((dispatch) => (dispatch({ type: `RESET_${name}_HEADIMG` })));

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
