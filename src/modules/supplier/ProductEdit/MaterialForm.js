import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { If } from 'jsx-control-statements';
import { Button, Col, Form, Input, Row, Select, Table } from 'antd';
import { each, groupBy, isEmpty, includes, map, merge, sortBy, union, uniqBy } from 'lodash';
import { fetchPreference } from 'redux/modules/supplyChain/preference';
import { saveMaterial, updateMaterial } from 'redux/modules/supplyChain/material';

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

  }

  componentWillMount() {
    this.props.fetchPreference();
  }

  componentWillReceiveProps(nextProps) {
    const { getFieldValue } = this.props.form;
    const { product, preference } = nextProps;
    if (preference.success && product.success && product.model && !isEmpty(product.model.extras)) {
      const { newProperties } = product.model.extras;
      this.props.form.setFieldsInitialValue({
        materials: this.findSelectedMaterials(newProperties, preference),
        ...this.generateInitial(newProperties),
      });
    }
    if (!isEmpty(getFieldValue('尺码对照参数')) && !(product.success && product.model && !isEmpty(product.model.extras))) {
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
    if (!isEmpty(getFieldValue('尺码对照参数'))) {
      newProperties.push({
        name: '尺码表',
        value: uniqBy(this.state.table, '尺码'),
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

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
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
    const { getFieldProps, getFieldValue } = this.props.form;
    return (
      <Form.Item {...this.formItemLayout()} label={item.name}>
        <If condition={isEmpty(item.values)} >
          <Input
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请输入${item.name}!` }] })}
            value={getFieldValue(item.name)}
            placehplder={`请输入${item.name}!`}
            />
        </If>
        <If condition={!isEmpty(item.values)} >
          <Select
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请选择${item.name}!` }] })}
            value={getFieldValue(item.name)}
            placehplder={`请输入${item.name}!`}
            multiple={item.id === 6}
            allowClear>
            {item.values.map((value) => (<Select.Option value={value}>{value}</Select.Option>))}
          </Select>
        </If>
      </Form.Item>
    );
  }

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
        title: property,
        dataIndex: property,
        key: property,
        render: (text, record) => (<Input
          data-key={property}
          data-size={record['尺码']}
          value={text}
          placehplder={`请输入${property}`}
          onInput={this.onInput}
          />),
      });
    });
    return uniqBy(columns, 'key');
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
    this.setState({ table: sortBy((uniqBy(data, '尺码')), '尺码') });
  }

  render() {
    const { preference, product, material } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue } = this.props.form;
    return (
      <Form>
        <Form.Item {...this.formItemLayout()} label="资料">
          <Select
            {...getFieldProps('materials', { rules: [{ required: true, message: '请选择要录入的资料！' }] })}
            value={getFieldValue('materials')}
            allowClear
            showSearch
            multiple>
            {preference.items.map((item) => (<Select.Option value={item.id}>{item.name}</Select.Option>))}
          </Select>
        </Form.Item>
        {preference.items.map((item) => {
          if (includes(getFieldValue('materials'), item.id)) {
            return this.formItem(item);
          }
          return null;
        })}
        <If condition={!isEmpty(getFieldValue('尺码对照参数'))}>
          <Form.Item {...this.formItemLayout()} label="尺码表" required>
            <Table columns={this.columns()} dataSource={this.state.table} pagination={false} />
          </Form.Item>
        </If>
        <Row style={{ marginTop: 10 }}>
          <Col offset="11" span="1">
            <Button onClick={this.onCancelClick}>取消</Button>
          </Col>
          <Col span="1">
            <Button type="primary" onClick={this.onSaveClick} loading={product.isLoading || material.isLoading}>保存</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}


export const MaterialForm = Form.create()(Material);
