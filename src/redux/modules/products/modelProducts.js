import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  results: [],
  count: 0,
};

const name = 'MODEL_PRODUCTS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    results: payload.data.results,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCHSCHEDULE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    results: payload.data.results,
    count: payload.data.count,
  }),
}, initialState);

export const fetchModelProducts = () => ({
  url: `${apisBase.item}model_product`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const deleteModelProducts = (id) => ({
  url: `${apisBase.item}model_product/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchModelProducts());
  },
});

export const fetchScheduleProducts = (filters) => ({
  url: `${apisBase.supply}schedule/modelproducts`,
  method: 'get',
  type: `FETCHSCHEDULE_${name}`,
  params: {
    ...filters,
  },
});
