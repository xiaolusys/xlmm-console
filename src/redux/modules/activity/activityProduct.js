import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'ACTIVITY_PRODUCT';

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
}, initialState);

export const fetchActivityProduct = (id) => ({
  url: `${apisBase.promotion}activity/active_pro?id=${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const saveActivityProduct = (id, activityID, params) => {
  if (activityID) {
    return ({
      url: `${apisBase.promotion}activity/${activityID}/create_pro`,
      method: 'post',
      type: `SAVE_${name}`,
      data: params,
    });
  }
  return ({
    url: `${apisBase.promotion}activity/${id}/update_pro`,
    method: 'post',
    type: `SAVE_${name}`,
    data: params,
  });
};
export const resetActivityProduct = () => ((dispatch) => (dispatch({ type: `RESET_${name}` })));

