import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const types = {
  FETCH_SCHEDULE: 'FETCH_SCHEDULE',
  SAVE_CHEDULE: 'SAVE_CHEDULE',
};

export default createReducer({
  [`${types.FETCH_SCHEDULE}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${types.FETCH_SCHEDULE}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`${types.FETCH_SCHEDULE}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${types.SAVE_CHEDULE}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${types.SAVE_CHEDULE}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: !_.isEmpty(payload.data),
  }),
  [`${types.SAVE_CHEDULE}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, {});

export const fetchSchedule = (scheduleId) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}`,
  method: 'get',
  type: types.FETCH_SCHEDULE,
});

export const saveSchedule = (id, params) => ({
  url: id ? `${apisBase.supply}saleschedule/${id}` : `${apisBase.supply}saleschedule`,
  method: id ? 'patch' : 'post',
  type: types.SAVE_CHEDULE,
  data: params,
});
