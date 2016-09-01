import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'CATEGORIES';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) =>{
    return {
      ...state,
      ...status,
      items: payload.data,
    };
  } ,
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchCategories = () => ({
  url: `${apisBase.supply}salescategory`,
  method: 'get',
  type: `FETCH_${name}`,
});
