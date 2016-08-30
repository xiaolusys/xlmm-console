import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Input, Table, Tabs, Modal, Steps } from 'antd';
import { fetchProduct, crawlProduct, saveProduct, updateProduct } from 'redux/modules/supplyChain/product';

const actionCreators = {
  fetchProduct: fetchProduct,
  crawlProduct: crawlProduct,
  saveProduct: saveProduct,
  updateProduct: updateProduct,
};

@connect(
  state => ({
    product: state.product,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class ProductEditWithForm extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    product: React.PropTypes.object,
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

  onCrawlProductClick = (e) => {
    const { supplierId } = this.props.location.query;
    const { productLink } = this.state;
    console.log(productLink, supplierId);
    this.props.crawlProduct(supplierId, encodeURIComponent(productLink));
  }

  onProductLinkChange = (e) => {
    this.setState({ productLink: e.target.value });
  }

  toggleCrawlProductModalVisible = (e) => {
    this.setState({ crawlProductModalVisible: !this.state.crawlProductModalVisible });
  }

  render() {
    const { prefixCls } = this.props;
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
            基本信息
          </Tabs.TabPane>
          <Tabs.TabPane tab="完善资料" key="material">
            完善资料
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


export const ProductEdit = Form.create()(ProductEditWithForm);
