import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { If } from 'jsx-control-statements';
import { Alert, Button, Col, Form, Input, Row, Select, Table, Checkbox, Radio, message } from 'antd';
import { assign, each, first, groupBy, isNull, isEmpty, includes, map, merge, parseInt, sortBy, union, uniqBy } from 'lodash';
import { fetchPreference } from 'redux/modules/supplyChain/preference';
import { saveMaterial, updateMaterial } from 'redux/modules/supplyChain/material';
import { fetchProduct } from 'redux/modules/products/stockProduct';
import { createModelProduct, updateModelProduct, fetchModelProduct } from 'redux/modules/products/modelProduct';
import { sizeSortCursor, sourceTypes } from 'constants';

const actionCreators = {
  fetchPreference,
  createModelProduct,
  updateModelProduct,
  fetchModelProduct,
  fetchProduct,
};

@connect(
  state => ({
    preference: state.preference,
    modelProduct: state.modelProduct,
    stockProduct: state.stockProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Material extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    preference: React.PropTypes.object,
    stockProduct: React.PropTypes.object,
    modelProduct: React.PropTypes.object,
    material: React.PropTypes.object,
    isBoutique: React.PropTypes.object,
    fetchProduct: React.PropTypes.object,
    fetchPreference: React.PropTypes.func,
    createModelProduct: React.PropTypes.func,
    updateModelProduct: React.PropTypes.func,
    fetchModelProduct: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    table: [],
  }

  componentWillMount() {
    this.props.fetchPreference();
    this.props.form.getFieldProps('尺码对照参数');
    if (this.props.stockProduct && this.props.stockProduct.modelId && this.props.stockProduct.modelId > 0) {
      this.props.fetchModelProduct(this.props.stockProduct.modelId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getFieldValue, getFieldProps } = this.props.form;
    const { stockProduct, preference, modelProduct } = nextProps;
    preference.items.map((item) => (
      this.props.form.getFieldProps(item.name)
    ));
    if (modelProduct && isEmpty(this.state.table) && (!isEmpty(modelProduct.extras))) {
      const { extras } = modelProduct;
      const { sources } = extras;
      let newProperties = [];
      if (extras && extras.newProperties) {
        newProperties = extras.newProperties;
      }
      let sourceType = 1;
      if (sources && sources.sourceType) {
        sourceType = sources.sourceType;
      }
      const kwargs = {
        materials: this.findSelectedMaterials(newProperties, preference),
        name: modelProduct.name,
        isBoutique: modelProduct.isBoutique,
        isTeambuy: modelProduct.isTeambuy,
        teambuyPrice: modelProduct.teambuyPrice,
        teambuyPersonNum: modelProduct.teambuyPersonNum,
        isOnsale: modelProduct.isOnsale,
        isFlatten: modelProduct.isFlatten,
        isWatermark: modelProduct.isWatermark,
         isRecommend: modelProduct.isRecommend,
        isOutside: modelProduct.isOutside,
        sourceType: sourceType,
        ...this.generateInitial(newProperties),
      };
      this.setState({
        modelProduct: modelProduct,
        preference: preference,
        stockProduct: stockProduct,
      });
      this.props.form.setFieldsInitialValue(kwargs);
    }
    if (this.isSkuSizeTableSelected() && isEmpty(this.state.table) && stockProduct.success) {
      this.dataSource(null, null);
    }
    if (modelProduct.updated) {
      message.success('保存成功！');
      modelProduct.updated = false;
      this.setState({ modelProduct: modelProduct });
      this.props.fetchProduct(stockProduct.id);
      return;
    }
  }

  onInput = (e) => {
    const { key, size } = e.target.dataset;
    const { value } = e.target;
    this.dataSource({
      key: key,
      size: size,
      value: value,
    }, null);
  }

  onCancelClick = () => {
    this.context.router.goBack();
  }

  onClickAddBoutique = (e) => {
    const isBoutique = e.target.checked;
    if (isBoutique) {
      this.props.form.setFieldsValue({ isBoutique: isBoutique });
    } else {
      message.error('目前要求说加入精品汇的商品不能退出！');
    }
  }

  onClickIsFlatten = (e) => {
    this.props.form.setFieldsValue({ isFlatten: e.target.checked });
  }

  onClickIsTeambuy = (e) => {
    this.props.form.setFieldsValue({ isTeambuy: e.target.checked });
  }

  onClickIsWatermark = (e) => {
    this.props.form.setFieldsValue({ isWatermark: e.target.checked });
  }

  onClickIsRecommend= (e) => {
    this.props.form.setFieldsValue({ isRecommend: e.target.checked });
  }

  onClickIsOutside= (e) => {
    this.props.form.setFieldsValue({ isOutside: e.target.checked });
  }

  onClickIsOnsale= (e) => {
    this.props.form.setFieldsValue({ isOnsale: e.target.checked });
  }

  onClickSourceType= (e) => {
    this.props.form.setFieldsValue({ sourceType: e.target.value });
  }

  onSaveClick = () => {
    const { getFieldsValue, getFieldValue } = this.props.form;
    const { stockProduct } = this.props;
    let { productId } = this.props.location.query;
    if (!productId) {
      productId = stockProduct.id;
    }
    const values = getFieldsValue();
    const newProperties = [];
    delete values.materials;
    map(values, (value, key) => {
      if (typeof(value) === 'undefined') {
         return;
      }
      if (['name', 'isBoutique', 'isTeambuy', 'isFlatten', 'isWatermark', 'isRecommend', 'isOutside', 'isOnsale', 'sourceType', 'teambuyPrice', 'teambuyPersonNum'].indexOf(key) >= 0) {
        return;
      }
      if (key === '尺码对照参数') {
        newProperties.push({
          name: key,
          value: union(['尺码'], value),
        });
      } else {
        newProperties.push({
          name: key,
          value: value,
        });
      }
    });
    const data = uniqBy(this.state.table, '尺码');
    if (!isEmpty(getFieldValue('尺码对照参数'))) {
      newProperties.push({
        name: '尺码表',
        value: this.sortSizeTable(data),
      });
    }
    const extras = {
      newProperties: newProperties,
      sources: {
        sourceType: getFieldValue('sourceType'),
      },
    };
    const params = {
      id: stockProduct.modelId,
      productId: productId,
      extras: extras,
      name: getFieldValue('name'),
      isBoutique: getFieldValue('isBoutique'),
      isTeambuy: getFieldValue('isTeambuy'),
      isFlatten: getFieldValue('isFlatten'),
      isWatermark: getFieldValue('isWatermark'),
      isRecommend: getFieldValue('isRecommend'),
      isOutside: getFieldValue('isOutside'),
      teambuyPrice: getFieldValue('teambuyPrice'),
      teambuyPersonNum: getFieldValue('teambuyPersonNum'),
    };
    if (stockProduct.modelId && stockProduct.modelId > 0) {
      this.props.updateModelProduct(stockProduct.modelId, params);
      return;
    }
    this.props.createModelProduct(params);
  }

  onIncrColumnValueClick = (value, label) => {
    if (isEmpty(value)) {
      return;
    }
    const type = value.split('-')[0];
    const incr = parseInt(value.split('-')[1]);
    const { table } = this.state;
    let nextItemValue = null;
    each(table, (rowItem) => {
      if (isNull(nextItemValue)) {
        nextItemValue = rowItem[type];
      } else {
        if (isNaN(nextItemValue)) {
          rowItem[type] = nextItemValue;
        } else {
          nextItemValue = parseFloat(nextItemValue) + incr;
          rowItem[type] = nextItemValue.toString();
        }
      }
    });
    this.setState({ table: table });
  }

  isSkuSizeTableSelected = () => {
    const materials = this.props.form.getFieldValue('materials');
    return includes(materials, 6); // 尺码对照参数id:6
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  })

  findSelectedMaterials = (newProperties, preference) => {
    const selected = [];
    each(preference.items, (item) => {
      each(newProperties, (property) => {
        if (item.name === property.name) {
          selected.push(item.id);
        }
      });
    });
    return selected;
  }

  generateInitial = (newProperties) => {
    // initilal
    const initilal = {};
    each(newProperties, (property) => {
      if (property.name !== '尺码表' && property.name !== 'teambuyPrice' && property.name !== 'teambuyPersonNum') {
        initilal[property.name] = property.value;
      }
      if (property.name === '尺码表') {
        this.dataSource(null, property.value);
      }
    });
    return initilal;
  }

  formItem = (item) => {
    const { newProperties } = this.state.modelProduct ? this.state.modelProduct.extras : [];
    const { getFieldProps, getFieldValue } = this.props.form;
    let itemValue = null;
    each(newProperties, (props) => {
      if (props.name === item.name) {
        itemValue = props.value;
      }
    });
    return (
      <Form.Item {...this.formItemLayout()} label={item.name}>
        <If condition={isEmpty(item.values)} >
          <Input
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请输入${item.name}!` }] })}
            value={getFieldValue(item.name) || itemValue}
            placehplder={`请输入${item.name}!`}
            />
        </If>
        <If condition={!isEmpty(item.values)} >
          <Select
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请选择${item.name}!` }] })}
            value={getFieldValue(item.name) || itemValue}
            placehplder={`请输入${item.name}!`}
            multiple={item.id === 6}
            allowClear>
            {item.values.map((value) => (<Select.Option value={value}>{value}</Select.Option>))}
          </Select>
        </If>
      </Form.Item>
    );
  }

  columnTitle = (text, type) => (
    <div>
      <label>{text}</label>
      <Select defaultValue="0" style={{ width: 45, marginLeft: 10 }} onChange={this.onIncrColumnValueClick}>
        {this.state.incrIndexs.map((incr) => (
          <Select.Option value={`${type}-${incr}`} >{incr}</Select.Option>
        ))}
      </Select>
    </div>
  )

  columns = () => {
    const { getFieldValue } = this.props.form;
    const properties = getFieldValue('尺码对照参数') || [];
    const columns = [{
      title: '尺码',
      dataIndex: '尺码',
      key: '尺码',
      width: 60,
    }];
    each(properties, (property) => {
      columns.push({
        title: this.columnTitle(property, property),
        dataIndex: property,
        key: property,
        render: (text, record) => (<Input data-key={property} data-size={record['尺码']} value={text} placehplder={`请输入${property}`} onInput={this.onInput} />),
      });
    });
    const cols = uniqBy(columns, 'key');
    return cols;
  }

  sortSizeTable = (dataTable, reverse = false) => {
    const firstSize = first(dataTable)['尺码'];
    if (!isNaN(firstSize)) {
      dataTable = sortBy(dataTable, (size) => (parseInt(size['尺码'])));
    } else if (sizeSortCursor.indexOf(firstSize.slice(0, 2)) > -1) {
      dataTable = sortBy(dataTable, (size) => {
        const index = sizeSortCursor.indexOf(size['尺码'].slice(0, 2));
        if (index > -1) {
          return index;
        }
        return sizeSortCursor.indexOf(size['尺码'].slice(0, 1));
      });
    } else if (sizeSortCursor.indexOf(firstSize.slice(0, 1)) > -1) {
      dataTable = sortBy(dataTable, (size) => (sizeSortCursor.indexOf(size['尺码'].slice(0, 1))));
    } else {
      dataTable = sortBy(dataTable, '尺码');
    }
    return dataTable;
  }

  dataSource = (params, origin) => {
    const { getFieldValue, setFieldsInitialValue } = this.props.form;
    const { stockProduct, material } = this.props;
    let data = this.state.table || [];
    map(groupBy(stockProduct.skuExtras, 'propertiesName'), (value, key) => {
      const item = {};
      item['尺码'] = key;
      data.push(item);
    });
    if (params) {
      each(data, (item) => {
        if (item['尺码'] === params.size) {
          item[params.key] = params.value;
        }
      });
    }
    if (origin) {
      data = merge(data, origin);
    }
    data = this.sortSizeTable(uniqBy(data, '尺码'));
    this.setState({ table: data });
  }

  render() {
    const { preference, stockProduct, material, modelProduct } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue, getFieldDecorator } = this.props.form;
    const showSizeTable = this.isSkuSizeTableSelected();
    return (
      <Form>
        <Form.Item {...this.formItemLayout()} label="售品名称" required>
          <Input
            {...getFieldProps('name', { rules: [{ required: true, message: '请输入售品名称！' }] })}
            value={getFieldValue('name')}
            placeholder="输入售品名称（显示在APP上的名称）"
            />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="货物来源">
          <Row style={{ marginTop: 16 }}>
            <Col span="10">
              <Radio.Group
                {...getFieldProps('sourceType')}
                value={getFieldValue('sourceType')}
                onChange={this.onClickSourceType}>
                {map(sourceTypes, (type) => (<Radio.Button value={type.id}>{type.lable}</Radio.Button>))}
              </Radio.Group>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="活动">
          <Checkbox
            {...getFieldProps('isBoutique')}
            checked={getFieldValue('isBoutique')}
            onChange={this.onClickAddBoutique}>
            加入精品汇
          </Checkbox>
          <Checkbox
            {...getFieldProps('isOnsale')}
            checked={getFieldValue('isOnsale')}
            onChange={this.onClickIsOnsale}>
            特价/秒杀
          </Checkbox>
          <Checkbox
            {...getFieldProps('isTeambuy')}
            checked={getFieldValue('isTeambuy')}
            onChange={this.onClickIsTeambuy}>
            团购
          </Checkbox>
          <Checkbox
            {...getFieldProps('isFlatten')}
            checked={getFieldValue('isFlatten')}
            onChange={this.onClickIsFlatten}>
            平铺显示
          </Checkbox>
          <Checkbox
            {...getFieldProps('isWatermark')}
            checked={getFieldValue('isWatermark')}
            onChange={this.onClickIsWatermark}>
            图片水印
          </Checkbox>
          <Checkbox
            {...getFieldProps('isRecommend')}
            checked={getFieldValue('isRecommend')}
            onChange={this.onClickIsRecommend}>
            推荐商品
          </Checkbox>
          <Checkbox
            {...getFieldProps('isOutside')}
            checked={getFieldValue('isOutside')}
            onChange={this.onClickIsOutside}>
            直邮
          </Checkbox>
        </Form.Item>
        <If condition={getFieldValue('isTeambuy')}>
          <Form.Item {...this.formItemLayout()} label="团购价" required>
            <Input
              {...getFieldProps('teambuyPrice', { rules: [{ required: true, message: '请输入团购优惠价！' }] })}
              value={getFieldValue('teambuyPrice')}
              placeholder="输入团购优惠价"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="团购人数" required>
            <Input
              {...getFieldProps('teambuyPersonNum', { rules: [{ required: true, message: '请输入成团人数！' }] })}
              value={getFieldValue('teambuyPersonNum')}
              placeholder="输入成团人数"
              />
          </Form.Item>
        </If>
        <Form.Item {...this.formItemLayout()} label="资料">
          <Select
            {...getFieldProps('materials', { rules: [{ required: true, message: '请选择要录入的资料！' }] })}
            value={getFieldValue('materials')}
            allowClear
            showSearch
            multiple>
            {preference.items.map((item) => (
              <Select.Option value={item.id}>{item.name}</Select.Option>)
            )}
          </Select>
        </Form.Item>
        {preference.items.map((item) => {
            if (includes(getFieldValue('materials'), item.id)) {
              return this.formItem(item);
            }
            return null;
          })
        }
        <If condition={showSizeTable}>
          <Form.Item {...this.formItemLayout()} label="尺码表" required>
            <Table
              columns={this.columns()}
              dataSource={this.state.table}
              pagination={false}
              />
          </Form.Item>
        </If>
        <Row style={{ marginTop: 10 }}>
          <Col offset="8" span="2">
            <Button onClick={this.onCancelClick}>返回</Button>
          </Col>
          <Col span="2">
            <Button type="primary" onClick={this.onSaveClick} loading={modelProduct.isLoading}>保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


export const MaterialForm = Form.create()(Material);
