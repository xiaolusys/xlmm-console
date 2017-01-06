import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'GIFT_TRANSFER_COUPON';

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

export const fetchGiftTransferCoupon = (params) => ({
  url: params ? `${apisBase.coupon}release_coupon/?buyer_id=${params.buyerId}&model_ids=${params.modelIds}&time_from=${params.timeFrom}&time_to=${params.timeTo}` : `${apisBase.coupon}release_coupon/`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const putGiftTransferCoupon = (params) => ({
  url: `${apisBase.coupon}release_coupon/`,
  method: 'post',
  type: `PUT_${name}`,
  data: params,
});
