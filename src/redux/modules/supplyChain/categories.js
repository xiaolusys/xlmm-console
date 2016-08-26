import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import _ from 'lodash'

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
      items:payload.data.results,
      count: payload.data.count,
    };
  } ,
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchCategories = (filters) => ({
  url: `${apisBase.supply}salescategory`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const deleteSupplier = (id, filters) => ({
  url: `${apisBase.supply}salescategory/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchCategories(filters));
  },
});