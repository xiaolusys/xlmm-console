import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'ACTIVITYPRODUCTS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data,
    count: payload.data.length,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchActivityProducts = (id) => ({
  url: `${apisBase.promotion}activity/${id}/active_pros`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const deleteActivityProduct = (id, params) => ({
  url: `${apisBase.promotion}activity/destroy_pro`,
  method: 'delete',
  type: `DELETE_${name}`,
  data: params,
  success: (resp, dispatch) => {
    dispatch(fetchActivityProducts(id));
  },
});
