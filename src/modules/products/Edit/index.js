import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Card, Checkbox, Col, Form, Input, Cascader, Popover, Radio, Tabs, Row, TreeSelect, Select, Tag, Modal, Table, message } from 'antd';
import { assign, map, difference, each, groupBy, includes, isEmpty, isArray, isMatch, last, merge, sortBy, toInteger, toArray, union, unionBy, uniqBy } from 'lodash';
import { Uploader } from 'components/Uploader';
import { If } from 'jsx-control-statements';
import { crawlProduct } from 'redux/modules/supplyChain/product';
import { createProduct, updateProduct, fetchProduct, resetProduct } from 'redux/modules/products/stockProduct';
import { saveSaleProducts, updateSaleProducts, fetchSaleProducts } from 'redux/modules/products/saleProducts.js';
import { createModelProduct, updateModelProduct, fetchModelProduct } from 'redux/modules/products/modelProduct';
import { resetSku } from 'redux/modules/products/sku.js';
import { replaceAllKeys, toErrorMsg } from 'utils/object';
import { imageUrlPrefixs, productTypes, boutiqueSkuTpl } from 'constants';
import changeCaseKeys from 'change-case-keys';
import { BasicForm } from './BasicForm';
import { SupplyForm } from './SupplyForm';
import { MaterialForm } from './MaterialForm';
import { PicturesForm } from './PicturesForm';

const actionCreators = {
  fetchProduct,
  crawlProduct,
  createProduct,
  updateProduct,
  resetProduct,
  saveSaleProducts,
  updateSaleProducts,
  createModelProduct,
  updateModelProduct,
  resetSku,
};

@connect(
  state => ({
    product: state.product,
    supplier: state.supplier,
    categories: state.categories,
    uptoken: state.uptoken,
    material: state.material,
    supply: state.supply,
    productId: state.productId,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

export class ProductEdit extends Component {

    static propTypes = {
      location: React.PropTypes.any,
      product: React.PropTypes.object,
      supply: React.PropTypes.object,
      supplier: React.PropTypes.object,
      categories: React.PropTypes.object,
      material: React.PropTypes.object,
      uptoken: React.PropTypes.object,
      prefixCls: React.PropTypes.object,
      fetchProduct: React.PropTypes.func,
      crawlProduct: React.PropTypes.func,
      createProduct: React.PropTypes.func,
      updateProduct: React.PropTypes.func,
      resetProduct: React.PropTypes.func,
      resetSku: React.PropTypes.func,
      saveSaleProducts: React.PropTypes.func,
      updateSaleProducts: React.PropTypes.func,
      createModelProduct: React.PropTypes.func,
      updateModelProduct: React.PropTypes.func,
    };

    static contextTypes = {
        router: React.PropTypes.object,
    };

    static defaultProps = {
        prefixCls: 'stock-product-edit',
    };

    constructor(props, context) {
        super(props);
        context.router;
    }

    state = {
      activeTabKey: 'basic',
      productId: '',
      productLink: '',
      crawlProductModalVisible: true,
      filters: {},
    }

    componentWillMount() {
      const { productId, tabKey } = this.props.location.query;
      if (productId) {
        this.setState({ activeTabKey: tabKey || 'basic' });
        this.props.fetchProduct(productId);
      }
    }

  componentWillReceiveProps(nextProps) {
    const { productId } = this.props.location.query;
    this.setState({ productId: productId });
    const { product, material } = nextProps;
    if (product.updated || material.updated) {
      message.success('保存成功！');
    }
    if (product.failure) {
      message.error(`请求错误: ${product.error.detail || ''}`);
    }
    if (material.failure) {
      message.error(`请求错误: ${material.error.detail || ''}`);
    }
  }

  componentWillUnmount() {
    this.props.resetProduct();
    this.props.resetSku();
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
      const { prefixCls, product, supplier, categories, location, uptoken, material, supply } = this.props;
      const { productId } = this.props.location.query;
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
          <Tabs defaultActiveKey={this.state.activeTabKey} onChange={this.onTabChange}>
            <Tabs.TabPane tab="基本信息" key="basic">
              <BasicForm product={product} supplier={supplier} categories={categories} location={location} uptoken={uptoken} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="供应信息" key="supply" disabled={!productId || !product.success}>
              <SupplyForm product={product} supply={supply} location={location} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="售卖信息" key="material" disabled={!productId || !product.success}>
              <MaterialForm product={product} material={material} location={location} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="商品图片" key="images" disabled={!productId || product.modelId === '0'}>
              <PicturesForm product={product} material={material} location={location} uptoken={uptoken} />
            </Tabs.TabPane>
          </Tabs>
          <If condition={!productId}>
            <Modal {...crawlProductModalProps}>
              <Input placeholder="请输入商品链接" onChange={this.onProductLinkChange} />
            </Modal>
          </If>
        </div>
      );
  }
}
