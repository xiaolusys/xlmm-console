import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';
import _ from 'lodash';

const initialState = {

};

const name = 'XLMM_CREATE_MAMA';

export default createReducer({
  [`SAVE_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`SAVE_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    res: payload.data,
  }),
  [`SAVE_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const createMama = (params) => ({
  url: `${apisBase.xiaolumm}mm/create_mama`,
  method: 'post',
  type: `SAVE_${name}`,
  data: params,
});
