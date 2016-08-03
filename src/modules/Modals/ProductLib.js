import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Modal, Input, Table, Popover } from 'antd';
import * as constants from 'constants';
import { fetchProducts } from 'redux/modules/supplyChain/products';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import { assign, isEmpty, isNaN, map, noop } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';

const actionCreators = { fetchProducts: fetchProducts, fetchFilters: fetchFilters };

@connect(
  state => ({
    filters: state.supplierFilters,
    products: state.products,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class ProductLib extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    visible: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onOk: React.PropTypes.func,
    suppliers: React.PropTypes.array,
    fetchFilters: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    filters: React.PropTypes.object,
    products: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-list',
    onOk: noop,
    onCancel: noop,
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
    selectedRowKeys: [],
  }

  componentWillMount() {
    this.setFilters({ saleSupplier: this.supplierIds() });
    this.props.fetchProducts(this.getFilters());
    this.props.fetchFilters();
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    if (filters.priceRange && !isNaN(Number(filters.priceRange.split(',')[0]))) {
      filters.minPrice = Number(filters.priceRange.split(',')[0]);
    }

    if (filters.priceRange && !isNaN(Number(filters.priceRange.split(',')[1]))) {
      filters.maxPrice = Number(filters.priceRange.split(',')[1]);
    }

    if (!filters.priceRange) {
      filters.minPrice = undefined;
      filters.maxPrice = undefined;
    }

    if (!filters.saleSupplier) {
      filters.saleSupplier = this.supplierIds();
    }

    delete filters.priceRange;
    this.setFilters(filters);
    this.props.fetchProducts(this.getFilters());
  }

  onOk = (e) => {
    this.props.onOk(this.state.selectedRowKeys);
    this.setState({ selectedRowKeys: [] });
  }

  onTableChange = (pagination, filters, sorter) => {
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = stringcase.snakecase(sorter.column.key);
        break;
      case 'descend':
        ordering = `-${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchProducts(this.getFilters());
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }


  getFilters = () => (this.state.filters)

  supplierIds = () => {
    const { suppliers } = this.props;
    return map(suppliers, (supplier) => (supplier.id)).join(',');
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => ([{
    title: '图片',
    key: 'picUrl',
    dataIndex: 'picUrl',
    width: 100,
    render: (productPic, record) => {
      const conetnt = (<img style={{ height: '360px' }} src={productPic} role="presentation" />);
      return (
        <Popover placement="right" content={conetnt} trigger="hover">
          <img style={{ height: '80px' }} src={productPic} role="presentation" />
        </Popover>
      );
    },
  }, {
    title: '商品名称',
    key: 'title',
    dataIndex: 'title',
    width: 200,
    render: (title, record) => (<a target="_blank" href={record.productLink}>{title}</a>),
  }, {
    title: '价格信息',
    key: 'allPrice',
    dataIndex: 'allPrice',
    width: 200,
    render: (text, record) => (
      <div>
        <p><span>售价：￥</span><span>{record.price}</span></p>
        <p><span>吊牌价：￥</span><span>{record.stdSalePrice}</span></p>
        <p><span>采购价：￥</span><span>{record.salePrice}</span></p>
      </div>
    ),
  }, {
    title: '销售信息',
    key: 'latestFigures',
    width: 200,
    dataIndex: 'latestFigures',
    render: (figures) => (
      <div>
        <p><span>销售额：</span><span>{figures ? `￥${figures.payment.toFixed(2)}` : '-'}</span></p>
        <p><span>退货率：</span><span>{figures ? figures.returnGoodRate : '-'}</span></p>
        <p><span>销售件数：</span><span>{figures ? figures.payNum : '-'}</span></p>
        <p><span>最后上架：</span>{figures ? moment(figures.upshelfTime).format('YYYY-MM-DD') : '-'}</p>
      </div>
    ),
  }, {
    title: '状态',
    key: 'status',
    width: 100,
    dataIndex: 'status',
  }, {
    title: '类目',
    key: 'saleCategory',
    dataIndex: 'saleCategory',
    width: 100,
    render: (saleCategory) => (<p>{saleCategory ? saleCategory.fullName : '-'}</p>),
  }, {
    title: '供应商',
    key: 'saleSupplier',
    dataIndex: 'saleSupplier',
    width: 200,
    render: (saleSupplier) => (
      <div>
        <p><span>名称：</span><span>{saleSupplier.supplierName}</span></p>
        <p><span>状态：</span><span>{saleSupplier.status}</span></p>
        <p><span>进度：</span><span>{saleSupplier.progress}</span></p>
      </div>
    ),
  }, {
    title: '录入日期',
    key: 'created',
    dataIndex: 'created',
    width: 100,
    render: (date) => (moment(date).format('YYYY-MM-DD')),
    sorter: true,
  }])

  tableProps = () => {
    const self = this;
    const { products } = this.props;
    const { selectedRowKeys } = this.state;
    return {
      rowKey: (record) => (record.id),
      rowSelection: {
        selectedRowKeys,
        onChange: this.onSelectChange,
      },
      pagination: {
        total: products.count,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchProducts(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(self.getFilters());
        },
      },
      scroll: { y: 500 },
      className: 'margin-top-sm',
      dataSource: products.items,
      onChange: this.onTableChange,
    };
  }

  render() {
    const { visible, filters, products, onCancel, suppliers } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal title="商品" width="1200" closable visible={visible} onOk={this.onOk} onCancel={onCancel}>
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={8}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleCategory')} allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item label="价格范围" {...this.formItemLayout()} >
                <Select {...getFieldProps('priceRange')} allowClear placeholder="请选择价格区间" notFoundContent="无可选项">
                  {map(constants.priceRanges, (range) => (<Select.Option value={range.value}>{range.lable}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item label="供应商" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleSupplier')} allowClear placeholder="请选择供应商" notFoundContent="无可选项">
                  {map(suppliers, (supplier) => (<Select.Option value={supplier.id}>{supplier.name}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="end" align="middle">
            <Col sm={2}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table {...this.tableProps()} columns={this.columns()} />
      </Modal>
    );
  }
}

export default Form.create()(ProductLib);
