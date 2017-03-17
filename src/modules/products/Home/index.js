import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Input, Select, Menu, Button, DatePicker, Table, Popover, Popconfirm, Form } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/products/stockProducts';
import { assign, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    products: state.products,
    filters: state.supplierFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    filters: React.PropTypes.object,
    products: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchProducts: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'products-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      type: 0,
      pageSize: 10,
      page: 1,
      ordering: '-created',
    },
  }

  componentWillMount() {
    this.props.fetchProducts(this.state.filters);
  }

  onCreateProductClick = (e) => {
    this.context.router.push('stockproduct/edit');
  }

  onSearchClick = (e) => {
    const filters = this.getFilters();
    filters.name = this.props.form.getFieldValue('name');
    this.setFilters(filters);
    this.props.fetchProducts(filters);
  }

  onDeleteClick = (e) => {
    const { productid } = e.currentTarget.dataset;
    this.props.deleteProduct(productid);
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)
  getFilterSelectValue = (field) => {
    const fieldValue = this.state.filters[field];
    return fieldValue ? { value: fieldValue } : {};
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })
  tableProps = () => {
    const self = this;
    const { products } = this.props;
    const { page, pageSize } = this.state.filters;
    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      pagination: {
        total: products.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        defaultCurrent: page,
        defaultPageSize: pageSize,
        onShowSizeChange(current, curPageSize) {
          self.setFilters({ pageSize: curPageSize, page: current });
          self.props.fetchProducts(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(self.getFilters());
        },
      },
      loading: products.isLoading,
      dataSource: products.items,
      onChange: this.onTableChange,
    };
  }

  columns = () => ([{
    title: '图片',
    key: 'picPath',
    dataIndex: 'picPath',
    width: 100,
    render: (productPic, record) => {
      const conetnt = (<img style={{ height: '360px' }} src={productPic} role="presentation" />);
      return (
        <Popover placement="right" content={conetnt} trigger="hover">
          <a target="_blank" href={`/admin/items/product/${record.modelId}/change/`} title={record.id}>
            <img style={{ width: '80px' }} src={productPic} role="presentation" />
          </a>
        </Popover>
       );
    },
  }, {
    title: '商品名称',
    key: 'name',
    dataIndex: 'name',
    width: 200,
    render: (title, record) => (<a target="_blank" href={`/admin/items/product/${record.id}/change/`}>{record.name}</a>),
  }, {
    title: '价格信息',
    key: 'cost',
    dataIndex: 'cost',
    width: 150,
    render: (text, record) => (
      <div>
        <p><span>售价：￥</span><span>{record.agentPrice}</span></p>
        <p><span>吊牌价：￥</span><span>{record.stdSalePrice}</span></p>
        <p><span>采购价：￥</span><span>{record.salePrice}</span></p>
      </div>
    ),
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 60,
  }, {
    title: '类目',
    key: 'category',
    dataIndex: 'category',
    width: 100,
    render: (category) => (<p>{category ? category.name : '-'}</p>),
  }, {
    title: '录入日期',
    key: 'created',
    dataIndex: 'created',
    width: 100,
    sorter: true,
  }, {
    title: '操作',
    dataIndex: 'id',
    key: 'operation',
    width: 80,
    render: (id, record) => (
      <ul style={{ display: 'block' }}>
        <li>
          <Link to={`/stockproduct/edit?productId=${id}`} >复制</Link>
        </li>
        <li>
          <Link to={`/stockproduct/edit?productId=${id}`} >编辑</Link>
        </li>
        <li>
          <Popconfirm placement="left" title={`确认删除(${record.title})吗？`} onConfirm={this.onDeleteConfirm} okText="删除" cancelText="取消">
            <a data-id={id} onClick={this.onDeleteClick}>删除</a>
          </Popconfirm>
        </li>
      </ul>
    ),
  }])

  render() {
    const { prefixCls, products } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    return (
      <div>
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="名称" {...this.formItemLayout()} >
                <Input {...getFieldProps('name')} placeholder="请输入商品名称" {...getFieldValue('name')} labelInValue />
              </Form.Item>
            </Col>
            <Col sm={6}>
              <div>
                <Button type="primary" onClick={this.onSearchClick}>搜索</Button>
              </div>
            </Col>
            <Col sm={6}>
              <div className={`${prefixCls}`} >
                <Button type="primary" onClick={this.onCreateProductClick}>新建商品</Button>
              </div>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" {...this.tableProps()} columns={this.columns()} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
