import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Modal, Input, Table } from 'antd';
import * as constants from 'constants';
import { fetchSuppliers } from 'redux/modules/supplyChain/suppliers';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import _ from 'lodash';

const actionCreators = { fetchSuppliers: fetchSuppliers, fetchFilters: fetchFilters };

@connect(
  state => ({
    filters: state.supplierFilters,
    suppliers: state.suppliers,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class SupplierLib extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    visible: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onOk: React.PropTypes.func,
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
    prefixCls: 'supplier-list',
    onOk: _.noop,
    onCancel: _.noop,
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
    selected: [],
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.fetchSuppliers(this.getFilters());
  }

  onSubmitClick = (e) => {
    this.setFilters(this.props.form.getFieldsValue());
    this.props.fetchSuppliers(this.getFilters());
  }

  onOk = () => {
    this.props.onOk(this.state.selected);
  }

  setFilters = (filters) => {
    this.setState(_.assign(this.state.filters, filters));
  }

  setSelected = (selected) => {
    this.setState(_.assign(this.state.selected, selected));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  })

  tableProps = () => {
    const self = this;
    const { suppliers } = this.props;
    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      columns: [{
        title: '名称',
        key: 'supplierName',
        dataIndex: 'supplierName',
        width: 200,
      }, {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        width: 200,
      }, {
        title: '进度',
        key: 'progress',
        dataIndex: 'progress',
        width: 200,
      }],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          const selected = _.map(selectedRows, (row) => ({ id: row.id, name: row.supplierName }));
          self.setSelected(selected);
        },
      },
      pagination: {
        total: suppliers.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchSuppliers(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchSuppliers(self.getFilters());
        },
      },
      useFixedHeader: true,
      scroll: { y: 400 },
    };
  }

  render() {
    const { visible, filters, suppliers, onCancel } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal title="供应商" width="800" closable visible={visible} onOk={this.onOk} onCancel={onCancel}>
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
        <Table {...this.tableProps()} loading={suppliers.isLoading} dataSource={suppliers.items} />
      </Modal>
    );
  }
}

export default Form.create()(SupplierLib);
