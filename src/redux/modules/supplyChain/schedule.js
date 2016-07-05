import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const name = 'SCHEDULE';

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
  [`SAVE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: !_.isEmpty(payload.data),
  }),
  [`SAVE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`RESET_${name}`]: (state, { payload, status }) => ({

  }),
}, {});

export const fetchSchedule = (scheduleId) => ({
  url: `${apisBase.supply}saleschedule/${scheduleId}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const saveSchedule = (id, params) => ({
  url: id ? `${apisBase.supply}saleschedule/${id}` : `${apisBase.supply}saleschedule`,
  method: id ? 'patch' : 'post',
  type: `SAVE_${name}`,
  data: params,
});

export const resetSchedule = () => ((dispatch) => (dispatch({ type: `RESET_${name}` })));
