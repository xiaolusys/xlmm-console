import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'NINEPICS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    count: payload.data.count,
    items: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchNinepics = (filters) => ({
  url: `${apisBase.xiaolumm}ninepic`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});

export const deleteNinepic = (id, filters) => ({
  url: `${apisBase.xiaolumm}ninepic/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchNinepics(filters));
  },
});
