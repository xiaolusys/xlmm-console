import createReducer from 'redux/createReducer';

const initialState = {
  scheduleList: {
      pageSize: 10,
      page: 1,
      ordering: '-sale_time',
    },
  scheduleProductList: {
      pageSize: 10,
      page: 1,
      ordering: 'order_weight',
    },
  supplierList: {
      pageSize: 10,
      page: 1,
      ordering: '',
    },
  supplierProductList: {
      pageSize: 10,
      page: 1,
      ordering: '-created',
      saleSupplier: '',
    },
  ninePicList: {
      pageSize: 10,
      page: 1,
      ordering: '-start_time',
    },
};

const name = 'STATE_FILTERS';

export default createReducer({
  [`GET_${name}`]: (state, { payload, status }) => ({
      ...state,
      ...status,
  }),
  [`SET_${name}`]: (state, { payload, status }) => {
    const { filterName, filterParams } = payload;
    state[filterName] = filterParams;
    return {
      ...state,
      ...status,
    };
  },
}, initialState);

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

