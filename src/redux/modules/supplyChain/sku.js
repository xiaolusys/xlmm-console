import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { each, union } from 'lodash';

const initialState = {
  items: [{
    id: 0,
    name: '统一规格',
    values: [],
  }],
};

const name = 'SKU';

const transformSku = (preferences) => {
  const items = [{
    id: 0,
    name: '统一规格',
    values: [],
  }];
  each(preferences, (preference) => {
    const values = [];
    each(preference.preferenceValue, (valueItem) => {
      const children = [];
      each(valueItem.value, (item) => {
        children.push({
          label: item,
          value: JSON.stringify({
            id: preference.id,
            name: preference.name,
            value: item,
          }),
        });
      });
      values.push({
        label: valueItem.name,
        value: valueItem.name,
        children: children,
      });
    });
    items.push({
      id: preference.id,
      name: preference.name,
      values: values,
    });
  });
  return items;
};

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: transformSku(payload.data),
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchSku = (categoryId) => ({
  url: `${apisBase.supply}preferencepool`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    configedCategory: categoryId,
    isSku: 'True',
  },
});
