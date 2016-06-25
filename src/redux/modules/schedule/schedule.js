import createReducer from 'redux/createReducer';

const initialState = {
  items: [],
  request: false,
  success: false,
  failure: false,
};

const types = { FETCH_SCHEDULE: 'FETCH_SCHEDULE' };

export default createReducer({
  [`${types.FETCH_SCHEDULE}_REQUEST`]: (state, { payload }) => ({
    ...state,
    request: true,
  }),
  [`${types.FETCH_SCHEDULE}_SUCCESS`]: (state, { payload }) => ({
    ...state,
    items: payload,
    success: true,
    request: false,
  }),
  [`${types.FETCH_SCHEDULE}_FAILURE`]: (state, { payload }) => ({
    ...state,
    request: false,
    failure: true,
  }),
}, initialState);

export const fetchSchedule = (scheduleId) => ({
  url: scheduleId ? `schedule/${scheduleId}` : 'schedule',
  method: 'get',
  type: types.FETCH_SCHEDULE,
  done: (resp, dispatch) => {

  },
  failure: (resp, dispatch) => {

  },
  always: (resp, dispatch) => {

  },
});
