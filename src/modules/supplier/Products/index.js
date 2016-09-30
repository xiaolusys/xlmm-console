import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Input, Table, Popover } from 'antd';
import moment from 'moment';
import stringcase from 'stringcase';
import { assign, isEmpty, isNaN, map, noop } from 'lodash';
import * as constants from 'constants';
import { fetchProducts, deleteProduct } from 'redux/modules/supplyChain/products';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';

const actionCreators = {
  fetchProducts,
  deleteProduct,
  fetchFilters,
};

@connect(
  state => ({
    filters: state.supplierFilters,
    products: state.products,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class ProductsWithForm extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
    filters: React.PropTypes.object,
    products: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-created',
      saleSupplier: this.props.location.query.supplierId,
    },
  }

  componentWillMount() {
    this.props.fetchProducts(this.getFilters());
    this.props.fetchFilters();
  }

  componentWillReceiveProps(nextProps) {

  }

  onCreateProductClick = (e) => {
    const { supplierId } = this.props.location.query;
    this.context.router.push(`/supplier/product/edit?supplierId=${supplierId}`);
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

    filters.page = 1;

    delete filters.priceRange;

    this.setFilters(filters);
    this.props.fetchProducts(this.getFilters());
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

  onDeleteClick = (e) => {
    const { id } = e.currentTarget.dataset;
    this.props.deleteProduct(id, this.getFilters());
  }

  onPreviewClick = (e) => {
    const { productid } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    this.setState({
      previewModalVisible: true,
      previewLink: `${protocol}//${host}/mall/product/details/${productid}?preview=true`,
    });
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

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
          <img style={{ width: '80px' }} src={productPic} role="presentation" />
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
    title: '最后上架销售信息',
    key: 'latestFigures',
    dataIndex: 'latestFigures',
    width: 200,
    render: (figures) => (
      <div>
        <p><span>销售额：</span><span>{figures ? `￥${figures.payment.toFixed(2)}` : '-'}</span></p>
        <p><span>退货率：</span><span>{figures ? figures.returnGoodRate : '-'}</span></p>
        <p><span>销售件数：</span><span>{figures ? figures.payNum : '-'}</span></p>
        <p><span>最后上架：</span>{figures ? moment(figures.upshelfTime).format('YYYY-MM-DD') : '-'}</p>
      </div>
    ),
  }, {
    title: '总销售信息',
    key: 'totalFigures',
    dataIndex: 'totalFigures',
    width: 200,
    render: (figures) => (
      <div>
        <p><span>销售额：</span><span>{figures.totalPayment ? `￥${figures.totalPayment.toFixed(2)}` : '-'}</span></p>
        <p><span>退货率：</span><span>{figures ? figures.totalRgRate : '-'}</span></p>
        <p><span>销售件数：</span><span>{figures.totalPayNum ? figures.totalPayNum : '-'}</span></p>
      </div>
    ),
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    width: 100,
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
  }, {
    title: '操作',
    dataIndex: 'id',
    key: 'operation',
    render: (id) => (
      <span>
        <Link to={`/supplier/product/edit?productId=${id}&supplierId=${this.props.location.query.supplierId}`}>编辑</Link>
        <span className="ant-divider"></span>
        <a data-id={id} onClick={this.onDeleteClick}>删除</a>
      </span>
    ),
  }])

  tableProps = () => {
    const self = this;
    const { products } = this.props;
    const { selectedRowKeys, page } = this.state;
    return {
      rowKey: (record) => (record.id),
      pagination: {
        total: products.count,
        current: page,
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
      className: 'margin-top-sm',
      dataSource: products.items,
      onChange: this.onTableChange,
      loading: products.isLoading,
    };
  }

  render() {
    const { prefixCls, filters, products } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleCategory')} allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="价格范围" {...this.formItemLayout()} >
                <Select {...getFieldProps('priceRange')} allowClear placeholder="请选择价格区间" notFoundContent="无可选项">
                  {map(constants.priceRanges, (range) => (<Select.Option value={range.value}>{range.lable}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateProductClick}>新增商品</Button>
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


export const Products = Form.create()(ProductsWithForm);
