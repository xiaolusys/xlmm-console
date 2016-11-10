import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
};

const name = 'ACTIVITY_PRODUCT_FILTERS';

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
}, initialState);

export const fetchActivitProductFilters = () => ({
  url: `${apisBase.promotion}activity/pro_list_filters`,
  method: 'get',
  type: `FETCH_${name}`,
});
