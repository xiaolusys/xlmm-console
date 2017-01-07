import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'SEND_ENVELOP_USER_BUDGET';

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


export const fetchUserBudget = (customerId) => ({
  url: customerId ? `${apisBase.mm}budget/send_envelop/?customer_id=${customerId}` : `${apisBase.mm}budget/send_envelop/?customer_id=1`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const sendEnvelopUserBudget = (params) => ({
  url: `${apisBase.mm}budget/send_envelop/`,
  method: 'post',
  type: `PUT_${name}`,
  data: params,
});
