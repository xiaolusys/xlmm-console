import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchSuppliers, deleteSupplier } from 'redux/modules/supplyChain/suppliers';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';

const actionCreators = {
  fetchSuppliers: fetchSuppliers,
  fetchFilters: fetchFilters,
  deleteSupplier: deleteSupplier,
};

@connect(
  state => ({
    filters: state.supplierFilters,
    suppliers: state.suppliers,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class HomeWithForm extends Component {

  static propTypes = {
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    fetchSuppliers: React.PropTypes.func,
    deleteSupplier: React.PropTypes.func,
    filters: React.PropTypes.object,
    suppliers: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '',
    },
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.fetchSuppliers();
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    filters.page = 1;
    if (filters.dateRange) {
      filters.createdStart = moment(filters.dateRange[0]).format('YYYY-MM-DD');
      filters.createdEnd = moment(filters.dateRange[1]).format('YYYY-MM-DD');
      delete filters.dateRange;
    }
    this.setFilters(filters);
    this.props.fetchSuppliers(this.getFilters());
  }

  onCreateSupplierClick = (e) => {
    this.context.router.push('supplier/edit');
  }

  onTableChange = (pagination, filters, sorter) => {
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = `${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      case 'descend':
        ordering = `-${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchSuppliers(this.getFilters());
  }

  onDeleteClick = (e) => {
    const { supplierid } = e.currentTarget.dataset;
    this.props.deleteSupplier(supplierid);
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [{
      title: '名称',
      key: 'supplierName',
      dataIndex: 'supplierName',
      width: 200,
    }, {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      width: 160,
    }, {
      title: '销售额',
      key: 'payment',
      dataIndex: 'figures',
      width: 160,
      sorter: true,
      render: (figures) => (<span>{figures ? figures.payment : '-'}</span>),
    }, {
      title: '销售件数',
      key: 'payNum',
      dataIndex: 'figures',
      width: 160,
      sorter: true,
      render: (figures) => (<span>{figures ? figures.payNum : '-'}</span>),
    }, {
      title: '退货率',
      key: 'returnGoodRate',
      dataIndex: 'figures',
      width: 160,
      sorter: true,
      render: (figures) => (<span>{figures ? figures.returnGoodRate : '-'}</span>),
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`supplier/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <a data-supplierid={id} onClick={self.onDeleteClick}>删除</a>
          <span className="ant-divider"></span>
          <Link to={`supplier/products?supplierId=${id}`}>商品</Link>
        </span>
      ),
    }];
  };

  tableProps = () => {
    const self = this;
    const { suppliers } = this.props;
    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          const selected = map(selectedRows, (row) => ({ id: row.id, name: row.supplierName }));
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
      loading: suppliers.isLoading,
      dataSource: suppliers.items,
      onChange: this.onTableChange,
    };
  }

  render() {
    const { filters } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div>
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('category')} allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierType')} allowClear placeholder="请选择供应商类型" notFoundContent="无可选项">
                  {map(filters.supplierType, (type) => (<Select.Option value={type[0]}>{type[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="区域" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierZone')} allowClear placeholder="请选择供应商区域" notFoundContent="无可选项">
                  {map(filters.supplierZone, (zone) => (<Select.Option value={zone[0]}>{zone[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Item label="录入时间" {...this.formItemLayout()} >
                <DatePicker.RangePicker {...getFieldProps('dateRange')} />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="名称" {...this.formItemLayout()} >
                <Input {...getFieldProps('supplierName')} placeholder="请输入供应商名称" />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateSupplierClick}>添加供应商</Button>
            </Col>
            <Col span={2} offset={20}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table {...this.tableProps()} columns={this.columns()} />
      </div>
    );
  }
}

export const Home = Form.create()(HomeWithForm);
