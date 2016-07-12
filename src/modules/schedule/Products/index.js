import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table, Checkbox, Input, Popover } from 'antd';
import { If } from 'jsx-control-statements';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import { fetchSchedule } from 'redux/modules/supplyChain/schedule';
import { fetchProducts, addProduct, updateProduct } from 'redux/modules/supplyChain/scheduleProducts';
import _ from 'lodash';

const actionCreators = { fetchSchedule, fetchProducts, addProduct, updateProduct };

@connect(
  state => ({
    scheduleProducts: state.scheduleProducts,
    schedule: state.schedule,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Products extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchSchedule: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    addProduct: React.PropTypes.func,
    updateProduct: React.PropTypes.func,
    schedule: React.PropTypes.object,
    scheduleProducts: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: 'order_weight',
    },
    modalVisible: false,
    productWeight: 1,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    this.props.fetchSchedule(id);
    this.props.fetchProducts(id, this.getFilters());
  }

  onOkClick = (selected) => {
    const { id } = this.props.location.query;
    this.props.addProduct(id, selected);
    this.toggleModalVisible();
  }

  onPromotionChange = (e) => {
    const { id } = this.props.location.query;
    const { checked, productId } = e.target;
    this.props.updateProduct(id, productId, {
      isPromotion: checked,
    }, this.getFilters());
  }

  onPositionClick = (e) => {
    const { id } = this.props.location.query;
    const { type, productid, weight } = e.currentTarget.dataset;
    let orderWeight = Number(weight);
    switch (type) {
      case 'up':
        orderWeight = Number(weight) - this.state.productWeight;
        break;
      case 'down':
        orderWeight = Number(weight) + this.state.productWeight;
        break;
      default:
        break;
    }
    this.props.updateProduct(id, productid, {
      orderWeight: orderWeight,
    }, this.getFilters());
  }

  getFilters = () => (this.state.filters)

  setFilters = (filters) => {
    this.setState(_.assign(this.state.filters, filters));
  }

  setProductWeight = (e) => {
    console.log(e);
    this.setState(_.assign(this.state, { productWeight: Number(e.target.value) }));
  }

  supplierIds = () => {
    const { schedule } = this.props;
    return _.map(schedule.saleSuppliers, (supplier) => (supplier.id)).join(',');
  }

  toggleModalVisible = (e) => {
    this.setState(_.assign(this.state, { modalVisible: !this.state.modalVisible }));
  }

  popover = (type, productId, weight) => {
    const { schedule } = this.props;
    const types = {
      up: {
        icon: 'arrow-up',
        addonBefore: '向上移动',
      },
      down: {
        icon: 'arrow-down',
        addonBefore: '向下移动',
      },
    };
    const buttonProps = {
      'data-productid': productId,
      'data-type': type,
      'data-weight': weight,
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Input type="number" addonBefore={types[type].addonBefore} addonAfter="个位置" defaultValue={1} onChange={this.setProductWeight} />
        <Button {...buttonProps} onClick={this.onPositionClick}>确认</Button>
      </div>
    );

    return (
      <Popover trigger="click" content={content} title="调整位置">
        <Button size="small" type="primary" shape="circle" icon={types[type].icon} disabled={schedule.lockStatus} />
      </Popover>
    );
  }
  tableProps = () => {
    const self = this;
    const { id } = this.props.location.query;
    const { scheduleProducts, schedule } = this.props;
    return {
      columns: [{
        title: '图片',
        dataIndex: 'productPic',
        key: 'productPic',
        width: 80,
        render: (productPic, record) => (<img style={{ height: '80px' }} src={productPic} role="presentation" />),
      }, {
        title: '名称',
        dataIndex: 'productName',
        key: 'productName',
        width: 200,
        render: (productName, record) => (<a target="_blank" href={record.productLink}>{productName}</a>),
      }, {
        title: '吊牌价',
        dataIndex: 'productOriginPrice',
        key: 'productOriginPrice',
        width: 80,
      }, {
        title: '售价',
        dataIndex: 'productSalePrice',
        key: 'productSalePrice',
        width: 80,
      }, {
        title: '采购价',
        dataIndex: 'productPurchasePrice',
        key: 'productPurchasePrice',
        width: 80,
      }, {
        title: '分类',
        dataIndex: 'saleCategory',
        key: 'saleCategory',
        width: 80,
      }, {
        title: '每日推送商品',
        dataIndex: 'id',
        key: 'id',
        width: 160,
        render: (productId, record) => {
          const checkboxProps = {
            checked: record.isPromotion,
            onChange: this.onPromotionChange,
            productId: productId,
            disabled: schedule.lockStatus,
          };
          return (
            <Checkbox {...checkboxProps}>设为推送</Checkbox>
          );
        },
      }, {
        title: '调整位置',
        dataIndex: 'orderWeight',
        key: 'orderWeight',
        width: 160,
        render: (orderWeight, record) => (
          <div style={{ width: 80, textAlign: 'center' }}>
            <div className="pull-left">
              {this.popover('up', record.id, record.orderWeight)}
            </div>
            <span>{record.orderWeight}</span>
            <div className="pull-right">
              {this.popover('down', record.id, record.orderWeight)}
            </div>
          </div>
        ),
      }, {
        title: '传图',
        dataIndex: 'upload',
        key: 'upload',
        width: 80,
        render: (text, record) => (<a target="_blank" href={`/mm/add_aggregeta/?search_model=${record.modelId}`} disabled={schedule.lockStatus}>上传图片</a>),
      }],
      pagination: {
        total: scheduleProducts.count || 0,
        showTotal: (total) => (`共 ${total} 条`),
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
      },
    };
  }

  render() {
    const { prefixCls } = this.props;
    const { schedule, scheduleProducts } = this.props;
    return (
      <div className={`${prefixCls}`} >
        <Row type="flex" justify="start">
          <Col span={3}>
            <Button type="primary" onClick={this.toggleModalVisible} disabled={schedule.lockStatus}>添加商品</Button>
          </Col>
        </Row>
        <Table {...this.tableProps()} className="margin-top-sm" loading={scheduleProducts.isLoading} dataSource={scheduleProducts.items} />
        <If condition={schedule.success}>
          <Modals.ProductLib visible={this.state.modalVisible} supplierIds={this.supplierIds()} onOk={this.onOkClick} onCancel={this.toggleModalVisible} />
        </If>
      </div>
    );
  }
}
