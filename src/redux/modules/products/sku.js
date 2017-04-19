import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';
import { each, union, uniqueId } from 'lodash';
import Immutable from 'immutable';

const initialState = {
  items: Immutable.fromJS([{
    id: 0,
    name: '统一规格',
    values: [],
  }]),
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
          key: item,
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
    values.push({
      label: '其他',
      value: '其他',
      children: [],
    });
    items.push({
      id: preference.id,
      name: preference.name,
      values: values,
    });
  });
  return items;
};

const addSkuItem = (originSkuItems, skuItem) => {
  const { id, skuValue } = skuItem;
  each(originSkuItems, (item) => {
    if (item.id === Number(id)) {
      each(item.values, (itemValue) => {
        if (itemValue.label === '其他') {
          itemValue.children = union(itemValue.children, [skuValue]);
        }
      });
    }
  });
};

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: Immutable.fromJS(transformSku(payload.data)),
    fetchSkuSuccess: true,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`ADD_${name}`]: (state, { payload, status }) => {
    const { skuItems } = payload;
    const propItems = state.items.toJS();
    each(skuItems, (item) => {
      addSkuItem(propItems, item);
    });
    return {
      ...state,
      ...status,
      items: Immutable.fromJS(propItems),
    };
  },
  [`RESET_${name}`]: (state, { payload, status }) => ({
    ...initialState,
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


export const addSku = (id, skuValue) => ({
  type: `ADD_${name}`,
  payload: {
    skuItems: [{
      id: id,
      skuValue: skuValue,
    }],
  },
});

export const batchAddSku = (skuItems) => ({
  type: `ADD_${name}`,
  payload: {
    skuItems: skuItems,
  },
});

export const resetSku = () => ({
  type: `RESET_${name}`,
});
