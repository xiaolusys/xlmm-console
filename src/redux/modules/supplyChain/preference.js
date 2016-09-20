import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { each, union } from 'lodash';

const initialState = {
  items: [],
};

const name = 'PREFERENCE';


export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchPreference = (categoryId) => ({
  url: `${apisBase.supply}preferencepool`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    configedCategory: categoryId,
    isSku: 'False',
  },
});
