import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchSuppliers, deleteSupplier } from 'redux/modules/supplyChain/suppliers';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import { getStateFilters, setStateFilters } from 'redux/modules/supplyChain/stateFilters';

const propsFiltersName = 'supplierList';

const actionCreators = {
  fetchSuppliers,
  fetchFilters,
  deleteSupplier,
  getStateFilters,
  setStateFilters,
};

@connect(
  state => ({
    filters: state.supplierFilters,
    suppliers: state.suppliers,
    stateFilters: state.stateFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class HomeWithForm extends Component {

  static propTypes = {
    location: React.PropTypes.any,
    filters: React.PropTypes.object,
    suppliers: React.PropTypes.object,
    fetchFilters: React.PropTypes.func,
    fetchSuppliers: React.PropTypes.func,
    deleteSupplier: React.PropTypes.func,
    form: React.PropTypes.object,
    stateFilters: React.PropTypes.object,
    getStateFilters: React.PropTypes.func,
    setStateFilters: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    delSupplierId: null,
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '',
    },
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.getStateFilters();
    const { stateFilters } = this.props;
    if (stateFilters) {
      this.setFilters(stateFilters[propsFiltersName]);
    }
    this.props.fetchSuppliers(this.getFilters());
  }

  componentWillReceiveProps(nextProps) {
    const { suppliers } = nextProps;
    if (suppliers.failure) {
      suppliers.error(`请求错误: ${suppliers.error.detail || ''}`);
    }
  }

  componentWillUnmount() {
    const { filters } = this.state;
    this.props.setStateFilters(propsFiltersName, filters);
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    filters.page = 1;
    if (filters.dateRange) {
      filters.createdStart = moment(filters.dateRange[0]).format('YYYY-MM-DD');
      filters.createdEnd = moment(filters.dateRange[1]).format('YYYY-MM-DD');
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

  onDeleteConfirm = (e) => {
    const { delSupplierId } = this.state;
    if (delSupplierId) {
      this.props.deleteSupplier(delSupplierId);
      this.setState({ delSupplierId: null });
    }
  }

  onDeleteClick = (e) => {
    const { supplierid } = e.currentTarget.dataset;
    this.setState({ delSupplierId: supplierid });
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => {
    const filters = this.state.filters;
    return {
      pageSize: filters.pageSize,
      page: filters.page,
      ordering: filters.ordering,
      category: filters.category ? filters.category.key : '',
      supplierType: filters.supplierType ? filters.supplierType.key : '',
      supplierZone: filters.supplierZone ? filters.supplierZone.key : '',
      supplierName: filters.supplierName || '',
      createdStart: filters.createdStart || '',
      createdEnd: filters.createdEnd || '',
    };
  }

  getFilterSelectValue = (field) => {
    const fieldValue = this.state.filters[field];
    return fieldValue ? { value: fieldValue } : {};
  }

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
      title: '创建时间',
      key: 'created',
      dataIndex: 'created',
      width: 160,
      render: (created) => (<p>{(created || '').split('T')[0]}</p>),
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      width: 100,
      render: (id, record) => (
        <span>
          <Link to={`supplier/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <Popconfirm placement="left" title={`确认删除(${record.supplierName})吗？`} onConfirm={this.onDeleteConfirm} okText="删除" cancelText="取消">
            <a data-supplierid={id} onClick={this.onDeleteClick}>删除</a>
          </Popconfirm>
          <span className="ant-divider"></span>
          <Link to={`supplier/products?supplierId=${id}`}>商品</Link>
        </span>
      ),
    }];
  };

  tableProps = () => {
    const self = this;
    const { suppliers } = this.props;
    const { page, pageSize } = this.state.filters;
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
        defaultCurrent: page,
        defaultPageSize: pageSize,
        onShowSizeChange(current, curPageSize) {
          self.setFilters({ pageSize: curPageSize, page: current });
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
                <Select {...getFieldProps('category')} {...this.getFilterSelectValue('category')} labelInValue allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierType')} {...this.getFilterSelectValue('supplierType')} labelInValue allowClear placeholder="请选择供应商类型" notFoundContent="无可选项">
                  {map(filters.supplierType, (type) => (<Select.Option value={type[0]}>{type[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="区域" {...this.formItemLayout()} >
                <Select {...getFieldProps('supplierZone')} {...this.getFilterSelectValue('supplierZone')} labelInValue allowClear placeholder="请选择供应商区域" notFoundContent="无可选项">
                  {map(filters.supplierZone, (zone) => (<Select.Option value={zone[0]}>{zone[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Form.Item label="录入时间" {...this.formItemLayout()} >
                <DatePicker.RangePicker {...getFieldProps('dateRange')} {...this.getFilterSelectValue('dateRange')} labelInValue />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="名称" {...this.formItemLayout()} >
                <Input {...getFieldProps('supplierName')} placeholder="请输入供应商名称" {...this.getFilterSelectValue('supplierName')} labelInValue />
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
