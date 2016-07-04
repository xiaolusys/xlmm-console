import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const type = 'FETCH_SUPPLIERS';

export default createReducer({
  [`${type}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${type}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    count: payload.data.count,
    items: payload.data.results,
  }),
  [`${type}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchSuppliers = (filters) => ({
  url: `${apisBase.supply}supplier`,
  method: 'get',
  type: type,
  params: {
    ...filters,
  },
});
