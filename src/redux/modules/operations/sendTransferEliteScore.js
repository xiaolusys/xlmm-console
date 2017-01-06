import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'SEND_TRANSFER_ELITE_SCORE';

export default createReducer({
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


export const sendEliteScore = (params) => ({
  url: `${apisBase.coupon}send_elite_score/`,
  method: 'post',
  type: `PUT_${name}`,
  data: params,
});
