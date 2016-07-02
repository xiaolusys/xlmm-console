import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';


const type = 'FETCH_SUPPLIERS';

export default createReducer({
  [`${type}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${type}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`${type}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, {});

export const fetchSuppliers = (filters) => ({
  url: `${apisBase.supply}supplier`,
  method: 'get',
  type: type,
  params: {
    ...filters,
  },
});
