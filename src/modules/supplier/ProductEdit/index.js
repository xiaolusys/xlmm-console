import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, Tag, Button, DatePicker, Input, Table, Tabs, Modal, Steps } from 'antd';
import { fetchProduct, crawlProduct, saveProduct, updateProduct } from 'redux/modules/supplyChain/product';
import { fetchSupplier } from 'redux/modules/supplyChain/supplier';
import { fetchCategories } from 'redux/modules/supplyChain/categories';
import { BasicForm } from './BasicForm';
import { MaterialForm } from './MaterialForm';

const actionCreators = {
  fetchProduct: fetchProduct,
  crawlProduct: crawlProduct,
  saveProduct: saveProduct,
  updateProduct: updateProduct,
  fetchSupplier: fetchSupplier,
  fetchCategories: fetchCategories,
};

@connect(
  state => ({
    product: state.product,
    supplier: state.supplier,
    categories: state.categories,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class ProductEdit extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    product: React.PropTypes.object,
    supplier: React.PropTypes.object,
    categories: React.PropTypes.object,
    filters: React.PropTypes.object,
    fetchCategories: React.PropTypes.func,
    fetchSupplier: React.PropTypes.func,
    fetchProduct: React.PropTypes.func,
    crawlProduct: React.PropTypes.func,
    saveProduct: React.PropTypes.func,
    updateProduct: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    productLink: '',
    crawlProductModalVisible: true,
  }

  componentWillMount() {
    const { supplierId, productId } = this.props.location.query;
    if (productId) {
      this.setState({ crawlProductModalVisible: false });
      this.props.fetchProduct(productId);
    }
    this.props.fetchSupplier(supplierId);
    this.props.fetchCategories();
  }

  onCrawlProductClick = (e) => {
    const { supplierId } = this.props.location.query;
    const { productLink } = this.state;
    this.props.crawlProduct(supplierId, productLink);
  }

  onProductLinkChange = (e) => {
    this.setState({ productLink: e.target.value });
  }

  toggleCrawlProductModalVisible = (e) => {
    this.setState({ crawlProductModalVisible: !this.state.crawlProductModalVisible });
  }

  render() {
    const { prefixCls, product, supplier, categories, location } = this.props;
    const crawlProductModalProps = {
      title: '抓取商品',
      okText: '抓取商品',
      cancelText: '手动录入',
      width: 600,
      visible: this.state.crawlProductModalVisible,
      onOk: this.onCrawlProductClick,
      onCancel: this.toggleCrawlProductModalVisible,
    };
    return (
      <div className={`${prefixCls}`}>
        <Tabs defaultActiveKey="basic" onChange={this.onTabChange}>
          <Tabs.TabPane tab="基本信息" key="basic">
            <BasicForm product={product} supplier={supplier} categories={categories} location={location} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="完善资料" key="material">
            <MaterialForm product={product} location={location} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="上传图片" key="images">
            上传图片
          </Tabs.TabPane>
        </Tabs>
        <Modal {...crawlProductModalProps}>
          <Input placeholder="请输入商品链接" onChange={this.onProductLinkChange} />
        </Modal>
      </div>
    );
  }
}
