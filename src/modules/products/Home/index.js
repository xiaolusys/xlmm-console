import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Input, Select, Menu, Button, DatePicker, Table, Popover, Popconfirm, Form, AutoComplete } from 'antd';
import * as constants from 'constants';
import { fetchProducts, deleteProduct, getStateFilters, setStateFilters } from 'redux/modules/products/stockProducts';
import { fetchSuppliers } from 'redux/modules/supplyChain/suppliers.js';
import { assign, map, trim } from 'lodash';
import moment from 'moment';

const propsFiltersName = 'productList';

const actionCreators = {
  fetchProducts,
  deleteProduct,
  getStateFilters,
  setStateFilters,
  fetchSuppliers,
};

@connect(
  state => ({
    products: state.products,
    filters: state.supplierFilters,
    suppliers: state.suppliers,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    deleteid: React.PropTypes.object,
    suppliers: React.PropTypes.object,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    filters: React.PropTypes.object,
    products: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchProducts: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
    getStateFilters: React.PropTypes.func,
    setStateFilters: React.PropTypes.func,
    fetchSuppliers: React.PropTypes.func,
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
    deleteid: '',
    filters: {
      type: '0',
      pageSize: 10,
      page: 1,
      status: 'normal',
      ordering: '-created',
      modelIds: '',
      supplierId: null,
    },
    supplierNames: [],
  }

  componentWillMount() {
    const { filters } = this.state;
    this.props.setStateFilters(propsFiltersName, filters);
    this.props.fetchProducts(this.getFilters());
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.filters) {
      this.props.form.setFieldsInitialValue(this.state.filters);
    }
    const { suppliers } = nextProps;
    if (suppliers) {
      const supplierNames = [];
      map(suppliers.items, (v, k) => {
        supplierNames.push(v.supplierName);
      });
      this.setState({ supplierNames: supplierNames });
    }
  }

  onCreateProductClick = (e) => {
    this.context.router.push('stockproduct/edit');
  }

  onSearchClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    this.setFilters(filters);
    this.props.fetchProducts(this.getFilters());
  }

  onDeleteClick = (e) => {
    this.props.deleteProduct(this.state.deleteid);
  }

  onDeleteIdSet = (e) => {
    this.setState({ deleteid: e.target.dataset.deleteid });
  }

  onSelectSupplier = (value) => {
    let supplierId;
    map(this.props.suppliers.items, (v, k) => {
      if (v.supplierName === value) {
        supplierId = v.id;
      }
    });
    const filters = this.getFilters();
    filters.supplierId = supplierId;
    this.setFilters(filters);
  }

  setFilters = (filters) => {
    const assignFilters = assign(this.state.filters, filters);
    this.setState(assignFilters);
  }

  getFilters = () => {
    const filters = this.state.filters;
    return {
      pageSize: filters.pageSize,
      page: filters.page,
      ordering: filters.ordering,
      shelfStatus: filters.shelfStatus || '',
      saleProduct: filters.saleProduct || '',
      modelId: filters.modelId || '',
      outerId: filters.outerId || '',
      wareBy: filters.wareBy || '',
      supplierId: filters.supplierId || '',
      status: filters.status || 'normal',
      type: filters.type || '0',
      name__contains: filters.name || '',
      model_id__in: filters.modelIds,
    };
  }

  getFilterSelectValue = (field) => {
    const fieldValue = this.props.form.getFieldValue(field);
    return fieldValue ? { value: fieldValue } : {};
  }

  handleChange = (e) => {
    console.log('e', e);
    if (e && trim(e) !== '') {
      this.props.fetchSuppliers({ supplierName: e });
    }
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
    title: '售品ID',
    key: 'modelId',
    dataIndex: 'modelId',
    width: 200,
    render: (title, record) => (<a>{record.modelId}</a>),
  }, {
    title: '商品名称',
    key: 'name',
    dataIndex: 'name',
    width: 200,
    render: (title, record) => (<a target="_blank" href={`/admin/items/product/${record.id}/change/`}>{record.name}</a>),
  }, {
    title: '商品编码',
    key: 'outerId',
    dataIndex: 'outerId',
    width: 100,
    render: (title, record) => (<a target="_blank" href={`/admin/items/product/${record.id}/change/`}>{record.outerId}</a>),
  }, {
    title: '价格信息',
    key: 'priceDict',
    dataIndex: 'priceDict',
    width: 100,
    render: (text, record) => (
      <div>
        <p><span>售价：￥</span><span>{record.priceDict.agentPrice}</span></p>
        <p><span>吊牌价：￥</span><span>{record.priceDict.stdSalePrice}</span></p>
        <p><span>采购价：￥</span><span>{record.priceDict.cost}</span></p>
      </div>
    ),
  }, {
    title: '库存',
    key: 'stockDict',
    dataIndex: 'stockDict',
    width: 100,
    render: (text, record) => {
      let s = '';
      map(record.stockDict, (v, k) => {
        if (v > 0) {
          s = `${s}${k}:${v}\n`;
        }
      });
      return (
        <div>
          {s}
        </div>);
    },
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 30,
  }, {
    title: '上架',
    key: 'shelfStatus',
    dataIndex: 'shelfStatus',
    width: 30,
  }, {
    title: '类目',
    key: 'saleCategory',
    dataIndex: 'saleCategory',
    width: 100,
    render: (saleCategory) => (<p>{saleCategory ? saleCategory.name : '-'}</p>),
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
          <Link to={`/stockproduct/edit?productId=${id}`} >编辑</Link>
        </li>
        <li>
          <Popconfirm placement="left" title={`确认删除(${record.name})吗？`} onConfirm={this.onDeleteClick} okText="删除" cancelText="取消">
            <a data-deleteid={record.id} onClick={this.onDeleteIdSet}>删除</a>
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
            <Col sm={3}>
              <Form.Item label="名称" {...this.formItemLayout()} >
                <Input {...getFieldProps('name')} placeholder="输入模糊商品名称" {...this.getFilterSelectValue('name')} labelInValue />
              </Form.Item>
            </Col>
            <Col sm={3}>
              <Form.Item label="编码" {...this.formItemLayout()} >
                <Input {...getFieldProps('outerId')} placeholder="输入完整商品编码" {...this.getFilterSelectValue('outerId')} labelInValue />
              </Form.Item>
            </Col>
            <Col sm={3}>
              <Form.Item label="售品ID" {...this.formItemLayout()} >
                <Input {...getFieldProps('modelIds')} placeholder="输入款式ID(多个以,分隔)" {...this.getFilterSelectValue('modelIds')} labelInValue />
              </Form.Item>
            </Col>
            <Col sm={5}>
              <Form.Item label="供应商名称" {...this.formItemLayout()} >
                <AutoComplete dataSource={this.state.supplierNames} style={{ width: 200, height: 25 }} onChange={this.handleChange} onSelect={this.onSelectSupplier} placeholder="输入供应商名称" />
                <Input type="hidden" {...getFieldProps('supplierId')} name="supplierId" value={this.state.supplierId} />
              </Form.Item>
            </Col>
            <Col sm={2}>
              <Form.Item label="上架" {...this.formItemLayout()} >
                <Select
                  {...getFieldProps('shelfStatus')}
                  {...this.getFilterSelectValue('shelfStatus')}
                  allowClear>
                  <Select.Option value="1">已上架</Select.Option>
                  <Select.Option value="0">未上架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={2}>
              <Form.Item label="仓库" {...this.formItemLayout()} >
                <Select
                  {...getFieldProps('wareBy')}
                  {...this.getFilterSelectValue('wareBy')}
                  allowClear>
                  <Select.Option value="1">上海仓</Select.Option>
                  <Select.Option value="2">广州仓</Select.Option>
                  <Select.Option value="3">公司仓</Select.Option>
                  <Select.Option value="4">蜂巢苏州仓</Select.Option>
                  <Select.Option value="5">蜂巢广州仓</Select.Option>
                  <Select.Option value="9">第三方仓</Select.Option>
                  <Select.Option value="10">蜂巢十里洋场</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={2}>
              <Form.Item label="类型" {...this.formItemLayout()} >
                <Select
                  {...getFieldProps('type')}
                  {...this.getFilterSelectValue('type')}
                  allowClear>
                  <Select.Option value="0">普通商品</Select.Option>
                  <Select.Option value="1">虚拟商品</Select.Option>
                  <Select.Option value="2">包材辅料</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={2}>
              <Form.Item label="状态" {...this.formItemLayout()} >
                <Select
                  {...getFieldProps('status')}
                  {...this.getFilterSelectValue('status')}
                  allowClear>
                  <Select.Option value="normal">使用</Select.Option>
                  <Select.Option value="remain">待用</Select.Option>
                  <Select.Option value="delete">作废</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col sm={2}>
              <Form.Item>
                <Button {...this.formItemLayout()} type="primary" onClick={this.onSearchClick}>搜索</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Row>
          <Col sm={6}>
            <Button onClick={this.onCreateProductClick}>新建商品</Button>
          </Col>
          <Col sm={6}>
            <a href="/admin/items/skustock/">SKU库存列表</a>
          </Col>
        </Row>
        <Table className="margin-top-sm" {...this.tableProps()} columns={this.columns()} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
