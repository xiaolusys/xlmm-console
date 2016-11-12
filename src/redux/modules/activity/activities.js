import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'ACTIVITIES';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    count: payload.data.count,
    items: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchActivities = (filters) => ({
  url: `${apisBase.promotion}activity`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});
