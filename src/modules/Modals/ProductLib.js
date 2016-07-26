import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Modal, Input, Table } from 'antd';
import * as constants from 'constants';
import { fetchProducts } from 'redux/modules/supplyChain/products';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import { assign, isNaN, map, noop } from 'lodash';
import moment from 'moment';

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
    supplierIds: React.PropTypes.string,
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
    selected: [],
  }

  componentWillMount() {
    const { supplierIds } = this.props;
    if (supplierIds) {
      this.setFilters({ saleSupplier: supplierIds });
    }
    this.props.fetchProducts(this.getFilters());
    this.props.fetchFilters();
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    if (!isNaN(Number(filters.priceRange.split(',')[0]))) {
      filters.minPrice = Number(filters.priceRange.split(',')[0]);
    }
    if (!isNaN(Number(filters.priceRange.split(',')[1]))) {
      filters.maxPrice = Number(filters.priceRange.split(',')[1]);
    }
    delete filters.priceRange;
    this.setFilters(filters);
    this.props.fetchProducts(this.getFilters());
  }

  onOk = (e) => {
    this.props.onOk(this.state.selected);
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  setSelected = (selected) => {
    this.setState(assign(this.state.selected, selected));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  tableProps = () => {
    const self = this;
    const { products } = this.props;
    return {
      rowKey: (record) => (record.id),
      columns: [{
        title: '图片',
        key: 'picUrl',
        dataIndex: 'picUrl',
        width: 140,
        render: (picUrl) => (<img style={{ height: '80px' }} src={picUrl} role="presentation" />),
      }, {
        title: '价格信息',
        key: 'allPrice',
        dataIndex: 'allPrice',
        width: 140,
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
        width: 80,
        dataIndex: 'status',
      }, {
        title: '类目',
        key: 'saleCategory',
        dataIndex: 'saleCategory',
        width: 120,
        render: (saleCategory) => (<p>{saleCategory ? saleCategory.fullName : '-'}</p>),
      }, {
        title: '供应商',
        key: 'saleSupplier',
        dataIndex: 'saleSupplier',
        width: 260,
        render: (saleSupplier) => (
          <div>
            <p><span>名称：</span><span>{saleSupplier.supplierName}</span></p>
            <p><span>状态：</span><span>{saleSupplier.status}</span></p>
            <p><span>进度：</span><span>{saleSupplier.progress}</span></p>
          </div>
        ),
      }],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          self.setSelected(selectedRowKeys);
        },
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
      scroll: { y: 400 },
    };
  }

  render() {
    const { visible, filters, products, onCancel } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <Modal title="商品" width="800" closable visible={visible} onOk={this.onOk} onCancel={onCancel}>
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
          </Row>
          <Row type="flex" justify="end" align="middle">
            <Col sm={4}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table {...this.tableProps()} className="margin-top-sm" dataSource={products.items} />
      </Modal>
    );
  }
}

export default Form.create()(ProductLib);
