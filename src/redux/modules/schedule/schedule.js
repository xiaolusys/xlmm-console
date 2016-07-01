import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const types = { FETCH_SCHEDULES: 'FETCH_SCHEDULES' };

export default createReducer({
  [`${types.FETCH_SCHEDULES}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${types.FETCH_SCHEDULES}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data.results.map((item => {
      const newItem = item;
      newItem.scheduleTypeLable = scheduleTypes[item.scheduleType].lable;
      return newItem;
    })) || [],
    count: payload.data.count,
  }),
  [`${types.FETCH_SCHEDULES}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchSchedules = (filters) => ({
  url: `${apisBase.supply}saleschedule`,
  method: 'get',
  type: types.FETCH_SCHEDULES,
  params: {
    ...filters,
  },
});
