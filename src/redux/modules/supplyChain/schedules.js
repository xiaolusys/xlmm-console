import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const type = 'FETCH_SCHEDULES';

export default createReducer({
  [`${type}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`${type}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data.results.map((item => {
      const newItem = item;
      newItem.scheduleTypeLable = scheduleTypes[item.scheduleType].lable;
      return newItem;
    })) || [],
    count: payload.data.count,
  }),
  [`${type}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchSchedules = (filters) => ({
  url: `${apisBase.supply}saleschedule`,
  method: 'get',
  type: type,
  params: {
    ...filters,
  },
});
