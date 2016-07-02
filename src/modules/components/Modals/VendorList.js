import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Modal, Input } from 'antd';
import * as constants from 'constants';
import * as suppliersAction from 'redux/modules/supplier/suppliers';
import * as filtersAction from 'redux/modules/supplier/filters';
import _ from 'lodash';

const actionCreators = _.merge(suppliersAction, filtersAction);

@connect(
  state => ({
    filters: state.supplierFilters,
    suppliers: state.supplier,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class VendorList extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    visible: React.PropTypes.bool,
    fetchFilters: React.PropTypes.func,
    fetchSuppliers: React.PropTypes.func,
    filters: React.PropTypes.object,
    suppliers: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
    },
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.fetchSuppliers(this.getFilters());
  }

  onSubmitClick = (e) => {
    this.setFilters(this.props.form.getFieldsValue());
    this.props.fetchSuppliers(this.getFilters());
  }

  setFilters = (filters) => {
    this.setState(_.assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  })

  render() {
    const { visible, filters, suppliers } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal title="供应商列表" width="800" visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
        <Form horizontal className="ant-advanced-search-form">
          <Row gutter={2}>
            <Col sm={8}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('category')} allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {_.map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item label="类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierType')} allowClear placeholder="请选择供应商类型" notFoundContent="无可选项">
                  {_.map(filters.supplierType, (type) => (<Select.Option value={type[0]}>{type[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item label="区域" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierZone')} allowClear placeholder="请选择供应商区域" notFoundContent="无可选项">
                  {_.map(filters.supplierZone, (zone) => (<Select.Option value={zone[0]}>{zone[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col sm={8}>
              <Form.Item label="名称" {...this.formItemLayout()} >
                <Input {...getFieldProps('supplierName')} placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ textAlign: 'right' }}>
            <Col span={3} offset={21}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(VendorList);
