import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'NINEPIC';

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

export const fetchNinepic = (id) => ({
  url: `${apisBase.xiaolumm}ninepic/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const saveNinepic = (id, params) => ({
  url: id ? `${apisBase.xiaolumm}ninepic/${id}` : `${apisBase.xiaolumm}ninepic`,
  method: id ? 'put' : 'post',
  type: `SAVE_${name}`,
  data: params,
});

export const resetNinepic = () => ((dispatch) => (dispatch({ type: `RESET_${name}` })));
