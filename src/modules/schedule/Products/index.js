import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table, Switch, Input } from 'antd';
import { If } from 'jsx-control-statements';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import { fetchSchedule } from 'redux/modules/supplyChain/schedule';
import { fetchProducts } from 'redux/modules/supplyChain/scheduleProducts';
import _ from 'lodash';

const actionCreators = { fetchSchedule, fetchProducts };

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
    },
    modalVisible: false,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    this.props.fetchSchedule(id);
    this.props.fetchProducts(id, this.getFilters());

  }

  onOkClick = (selected) => {
    this.toggleModalVisible();
  }

  getFilters = () => (this.state.filters)

  setFilters = (filters) => {
    this.setState(_.assign(this.state.filters, filters));
  }

  supplierIds = () => {
    const { schedule } = this.props;
    return _.map(schedule.saleSuppliers, (supplier) => (supplier.id)).join(',');
  }

  toggleModalVisible = (e) => {
    this.setState(_.assign(this.state, { modalVisible: !this.state.modalVisible }));
  }

  tableProps = () => {
    const self = this;
    const { id } = this.props.location.query;
    const { scheduleProducts } = this.props;
    return {
      columns: [{
        title: '图片',
        dataIndex: 'productPic',
        key: 'productPic',
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
      }, {
        title: '售价',
        dataIndex: 'productSalePrice',
        key: 'productSalePrice',
      }, {
        title: '采购价',
        dataIndex: 'productPurchasePrice',
        key: 'productPurchasePrice',
      }, {
        title: '分类',
        dataIndex: 'saleCategory',
        key: 'saleCategory',
      }, {
        title: '每日推送商品',
        dataIndex: 'isPromotion',
        key: 'isPromotion',
        render: (isPromotion) => (<Switch checked={isPromotion} />),
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
            <Button type="primary" onClick={this.toggleModalVisible}>添加商品</Button>
          </Col>
        </Row>
        <Table {...this.tableProps()} className="margin-top-sm" loading={scheduleProducts.isLoading} dataSource={scheduleProducts.items} />
        <If condition={schedule.success}>
          <Modals.ProductLib visible={this.state.modalVisible} supplierIds={this.supplierIds()} onOK={this.onOkClick} onCancel={this.toggleModalVisible} />
        </If>
      </div>
    );
  }
}
