import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'PRODUCTS';

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

export const fetchProducts = (filters) => ({
  url: `${apisBase.item}stock_product`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const deleteProduct = (id) => ({
  url: `${apisBase.item}stock_product/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchProducts());
  },
});

export const getStateFilters = (filterName) => ({
    type: `GET_${name}`,
    payload: {
      filterName: filterName,
    },
});

export const setStateFilters = (filterName, filterParams) => ({
  type: `SET_${name}`,
  payload: {
      filterName: filterName,
      filterParams: filterParams,
    },
});

