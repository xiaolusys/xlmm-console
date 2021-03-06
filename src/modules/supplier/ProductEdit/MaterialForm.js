import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { If } from 'jsx-control-statements';
import { Alert, Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { assign, each, first, groupBy, isNull, isEmpty, includes, map, merge, parseInt, sortBy, union, uniqBy } from 'lodash';
import { fetchPreference } from 'redux/modules/supplyChain/preference';
import { saveMaterial, updateMaterial } from 'redux/modules/supplyChain/material';
import { sizeSortCursor } from 'constants';

const actionCreators = {
  fetchPreference,
  saveMaterial,
  updateMaterial,
};

@connect(
  state => ({
    preference: state.preference,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Material extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    preference: React.PropTypes.object,
    product: React.PropTypes.object,
    material: React.PropTypes.object,
    fetchPreference: React.PropTypes.func,
    saveMaterial: React.PropTypes.func,
    updateMaterial: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    incrIndexs: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    table: [],
    firstLoadSuccessUpdate: false,
  }

  componentWillMount() {
    this.props.fetchPreference();
    this.props.form.getFieldProps('尺码对照参数');
  }

  componentWillReceiveProps(nextProps) {
    const { getFieldValue } = this.props.form;
    const { product, preference } = nextProps;
    if (preference.success && product.success && product.model && !this.state.firstLoadSuccessUpdate) {
      this.statefirstLoadSuccessUpdate = true;
      const { newProperties } = product.model.extras;
      const kwargs = {
        materials: this.findSelectedMaterials(newProperties, preference),
        ...this.generateInitial(newProperties),
      };
      this.props.form.setFieldsInitialValue(kwargs);
    }
    if (this.isSkuSizeTableSelected() && isEmpty(this.state.table) && product.success) {
      this.dataSource(null, null);
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

  onSaveClick = () => {
    const { getFieldsValue, getFieldValue } = this.props.form;
    const { product } = this.props;
    const { productId } = this.props.location.query;
    const values = getFieldsValue();
    const newProperties = [];
    delete values.materials;
    map(values, (value, key) => {
      if (typeof(value) === 'undefined') {
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
    const params = {
      saleproductId: productId,
      newProperties: newProperties,
    };
    if (product.model) {
      this.props.updateMaterial(params);
      return;
    }
    this.props.saveMaterial(params);
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
    const initilal = {};
    each(newProperties, (property) => {
      if (property.name !== '尺码表') {
        initilal[property.name] = property.value;
      }
      if (property.name === '尺码表') {
        this.dataSource(null, property.value);
      }
    });
    return initilal;
  }

  formItem = (item) => {
    const { newProperties } = this.props.product.model ? this.props.product.model.extras : [];
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
  );

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
        render: (text, record) => (<Input
          data-key={property}
          data-size={record['尺码']}
          value={text}
          placehplder={`请输入${property}`}
          onInput={this.onInput}
          />
        ),
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
    const { product, material } = this.props;
    let data = this.state.table || [];
    map(groupBy(product.skuExtras, 'propertiesName'), (value, key) => {
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
    const { preference, product, material } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue, getFieldDecorator } = this.props.form;
    const showSizeTable = this.isSkuSizeTableSelected();
    return (
      <Form>
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
            getFieldProps(item.name);
            if (includes(getFieldValue('materials'), item.id)) {
              return this.formItem(item);
            }
            return null;
          })
        };
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
            <Button type="primary" onClick={this.onSaveClick} loading={product.isLoading || material.isLoading}>保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


export const MaterialForm = Form.create()(Material);
