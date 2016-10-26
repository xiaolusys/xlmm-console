import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  items: [],
};

const name = 'NINEPIC_PROMOTIONPROS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchPromotionPros = (date) => ({
  url: `${apisBase.xiaolumm}ninepic/get_promotion_product?date=${date}`,
  method: 'get',
  type: `FETCH_${name}`,
});
