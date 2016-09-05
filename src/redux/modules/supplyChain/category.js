import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'CATEGORY';

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
  [`SAVE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: !_.isEmpty(payload.data),
  }),
  [`SAVE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`RESET_${name}`]: (state, { payload, status }) => ({

  }),
}, initialState);

export const fetchCategory = (id) => ({
  url: `${apisBase.supply}salescategory/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const saveCategory = (id, params) => ({
  url: id ? `${apisBase.supply}salescategory/${id}` : `${apisBase.supply}salescategory`,
  method: id ? 'put' : 'post',
  type: `SAVE_${name}`,
  data: params,
});

export const resetCategory = () => ((dispatch) => (dispatch({ type: `RESET_${name}` })));
