import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  count: 0,
  items: [],
  item: [],
  create: false,
};

const name = 'APPBANNERS';
const singleName = 'APPBANNER';
export default createReducer({
  [`FETCH_${singleName}_REQUEST`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('正在请求获取');
    return {
    ...state,
    ...status,
    };
  },
  [`FETCH_${singleName}_SUCCESS`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('获取成功');
    return {
    ...state,
    ...status,
    item: payload.data.items,
    title: payload.data.title,
    category: payload.data.category,
    isActive: payload.data.isActive,
    activeTime: payload.data.activeTime,
    count: 1,
    };
  },
  [`FETCH_${singleName}_FAILURE`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('获取失败');
    return {
    ...state,
    ...status,
    };
  },
  [`CREATE_${singleName}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`CREATE_${singleName}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    item: payload.data,
    count: 1,
    create: true,
  }),
  [`CREATE_${singleName}_FAILURE`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('创建失败');
    return {
    ...state,
    ...status,
    };
  },
  [`UPDATE_${singleName}_REQUEST`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('正在请求更新');
    return {
    ...state,
    ...status,
    updated: false,
    };
  },
  [`UPDATE_${singleName}_SUCCESS`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('更新成功');
    return {
      ...state,
      ...status,
      item: payload.data.items,
      count: 1,
      updated: true,
    };
  },
  [`UPDATE_${singleName}_FAILURE`]: (state, { payload, status }) => {
    const data = payload;
    // console.log('更新失败');
    return {
    ...state,
    ...status,
    updated: false,
    item: [],
    };
  },
  [`RESET_${singleName}`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    updated: false,
    create: false,
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

export const fetchAppBanners = (filters) => ({
  url: '/rest/v2/poster',
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
    },
});

export const fetchAppBanner = (id) => ({
  url: `/rest/v2/poster/${id}`,
  method: 'get',
  type: `FETCH_${singleName}`,
});

export const updateAppBanner = (id, params) => ({
  url: `/rest/v2/poster/${id}`,
  method: 'put',
  type: `UPDATE_${singleName}`,
  data: params,
});

export const createAppBanner = (params) => ({
  url: '/rest/v2/poster',
  method: 'post',
  type: `CREATE_${singleName}`,
  data: params,
});

export const saveAppBanner = (params) => ({
  url: '',
  method: 'post',
  type: `SAVE_${singleName}`,
  data: params,
});

export const resetAppBanner = () => ({
  type: `RESET_${singleName}`,
});
