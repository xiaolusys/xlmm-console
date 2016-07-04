import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';


const type = 'FETCH_SCHEDULE';

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

export const fetchSchedule = (scheduleId) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}`,
  method: 'get',
  type: type,
});
