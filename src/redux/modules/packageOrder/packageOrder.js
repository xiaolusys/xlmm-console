import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  count: 0,
  items: [],
  item: [],
};

const name = 'PACKAGEORDERS';
const singleName = 'PACKAGEORDER';
export default createReducer({
  [`FETCH_${singleName}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${singleName}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    item: payload.data.packageOrder,
    count: 1,
  }),
  [`FETCH_${singleName}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),

  [`UPDATE_${singleName}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`UPDATE_${singleName}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    item: payload.data,
    count: 1,
    updated: true,
  }),
  [`UPDATE_${singleName}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`CHANGETOPREPARE_${singleName}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
  }),
  [`CHANGETOPREPARE_${singleName}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: true,
  }),
  [`CHANGETOPREPARE_${singleName}_FAILURE`]: (state, action) => ({
    ...state,
    ...action.status,
    updated: false,
    error: action.status.error,
  }),
  [`RESET_${singleName}`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
    count: 0,
    items: [],
    item: [],
  }),

  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data.results,
    count: payload.data.count,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchPacakgeOrders = (filters) => ({
  url: '/trades/package_order.json',
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
    },
});

export const fetchPackageOrder = (id) => ({
  url: `/trades/package_order/${id}?format=json`,
  method: 'get',
  type: `FETCH_${singleName}`,
});

export const savePackageOrder = (params) => ({
  url: '/trades/package_order',
  method: 'post',
  type: `SAVE_${singleName}`,
  data: params,
});

export const updatePackageOrder = (id, params) => ({
  url: `/trades/package_order/${id}`,
  method: 'patch',
  type: `UPDATE_${singleName}`,
  data: params,
});

export const changeToPrepare = (params) => ({
  url: '/trades/package_order/change_to_prepare',
  method: 'post',
  type: `CHANGETOPREPARE_${singleName}`,
  data: params,
});

export const resetPackageOrder = () => ({
  type: `RESET_${singleName}`,
});
