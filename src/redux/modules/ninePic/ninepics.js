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
    items: payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchNinepics = () => ({
  url: `${apisBase.xiaolumm}ninepic`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const deleteNinepic = (id) => ({
  url: `${apisBase.xiaolumm}ninepic/${id}`,
  method: 'delete',
  type: `DELETE_${name}`,
  success: (resp, dispatch) => {
    dispatch(fetchNinepics());
  },
});
