import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'GIVE_XIAOLUMAMA_XIAOLUCOIN';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    results: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`PUT_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`PUT_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    results: payload.data,
  }),
  [`PUT_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);


export const fetchXiaoluCoin = (id) => ({
  url: `${apisBase.xiaolummbase}xiaolucoin/balance?mama_id=${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const giveXiaoluCoin = (params) => ({
  url: `${apisBase.xiaolummbase}xiaolucoin/change`,
  method: 'post',
  type: `PUT_${name}`,
  data: params,
});
