import createReducer from 'redux/createReducer';
import { apisBase } from 'constants';

const initialState = {
};

const name = 'SELECTTAB';

export default createReducer({
  [`CHANGETAB_${name}`]: (state, { payload, status }) => {
    const resp = {
      ...state,
      ...status,
      ...payload,
      activeTabKey: 'supply',
    };
    return resp;
  },
}, initialState);


export const changeTabProduct = (key) => ({
  type: `CHANGETAB_${name}`,
});
