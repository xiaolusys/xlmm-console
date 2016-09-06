import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash';

const name = 'SKU';

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
}, {});

export const fetchSku = (categoryId) => ({
  url: `${apisBase.supply}preferencepool`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    configedCategory: categoryId,
  },
});
