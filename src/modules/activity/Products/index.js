import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form, message, Popconfirm, Input } from 'antd';
import * as constants from 'constants';
import { fetchActivityProducts, deleteActivityProduct, updateActivityProductPosition } from 'redux/modules/activity/activityProducts';
import { assign, isEmpty, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchActivitProductFilters } from 'redux/modules/activity/activityProductFilters';


const actionCreators = {
  fetchActivitProductFilters,
  fetchActivityProducts,
  deleteActivityProduct,
  updateActivityProductPosition,
};

@connect(
  state => ({
    activityProducts: state.activityProducts,
    filters: state.activityProductFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class ActivityProductsList extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    prefixCls: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchActivityProducts: React.PropTypes.func,
    fetchActivitProductFilters: React.PropTypes.func,
    filters: React.PropTypes.object,
    deleteActivityProduct: React.PropTypes.func,
    activityProducts: React.PropTypes.object,
    updateActivityProductPosition: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activityProducts-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-id',
    },
    distance: 1,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    this.props.fetchActivityProducts(id);
    this.props.fetchActivitProductFilters();
  }

  componentWillReceiveProps(nextProps) {
    const { activityProducts } = nextProps;
    if (activityProducts.failure) {
      message.error(`请求错误: ${activityProducts.error.detail || ''}`);
    }
  }
  onDeleteProClick = (e) => {
    const { deleteid } = e.currentTarget.dataset;
    this.setState({ deleteid: deleteid });
  }

  onCreateActivityProductClick = (e) => {
    const { id } = this.props.location.query;
    const path = ['activity/product/edit?activityId=', id].join('');
    this.context.router.push(path);
  }

  onActivityProDeleteConfirm = (e) => {
    const { deleteid } = this.state;
    console.log(deleteid);
    if (deleteid) {
      const { id } = this.props.location.query;
      this.props.deleteActivityProduct(id, { id: deleteid });
      this.setState({ deleteid: null });
    }
  }

  onDeleteAcProCancel = (e) => {
    this.setState({ deleteid: null });
  }
  onUpdatePositionClick = (e) => {
    const { id } = this.props.location.query;
    const { direction, activityproductid } = e.currentTarget.dataset;
    const params = { direction: direction, activityProductId: activityproductid, distance: this.state.distance };
    this.props.updateActivityProductPosition(id, params);
    console.log(id, direction, activityproductid, this.state.distance);
  }
  setDistance = (e) => {
    console.log(e.target.value);
    this.setState({ distance: e.target.value });
  }
  ajustPositionPopover = (activityProductId, direction) => {
    const directions = {
      minus: {
        icon: 'arrow-up',
        addonBefore: '向上移动',
      },
      plus: {
        icon: 'arrow-down',
        addonBefore: '向下移动',
      },
    };
    const buttonProps = {
      'data-activityProductId': activityProductId,
      'data-direction': direction,
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Input type="number" addonBefore={directions[direction].addonBefore} addonAfter="个位置" defaultValue={1} onChange={this.setDistance} />
        <Button {...buttonProps} onClick={this.onUpdatePositionClick}>确认</Button>
      </div>
    );

    return (
      <Popover trigger="click" content={content} title="调整位置">
        <Button size="small" type="primary" shape="circle" icon={directions[direction].icon} />
      </Popover>
    );
  }
  columns = () => {
    const self = this;
    return [{
      title: '款式id',
      dataIndex: 'modelId',
      key: 'modelId',
    }, {
      title: '图片',
      dataIndex: 'productImg',
      key: 'productImg',
      render: (productImg, record) => {
        const conetnt = (<img style={{ height: '360px' }} src={productImg} role="presentation" />);
        return (
          <Popover placement="right" content={conetnt} trigger="hover">
            <a target="_blank" href={`${record.jumpUrl}`}>
              <img style={{ height: '80px' }} src={productImg} role="presentation" />
            </a>
          </Popover>
        );
      },
    }, {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
    }, {
      title: '图片设置',
      dataIndex: 'getPicTypeDisplay',
      key: 'getPicTypeDisplay',
    }, {
      title: '位置',
      dataIndex: 'locationId',
      key: 'locationId',
    }, {
      title: '调整位置',
      dataIndex: 'orderWeight',
      key: 'orderWeight',
      render: (orderWeight, record) => (
        <div style={{ width: 60, textAlign: 'center' }}>
          <div className="pull-left">
            {this.ajustPositionPopover(record.id, 'plus')}
          </div>
          <div className="pull-right">
            {this.ajustPositionPopover(record.id, 'minus')}
          </div>
        </div>
      ),
    },
     {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`activity/product/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <Popconfirm title="删除这条记录?" onConfirm={this.onActivityProDeleteConfirm} onCancel={this.onDeleteAcProCancel} okText="删除" cancelText="取消">
            <a data-deleteid={id} onClick={this.onDeleteProClick}>删除</a>
          </Popconfirm>
        </span>
      ),
    }];
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  render() {
    const { prefixCls, activityProducts } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateActivityProductClick}>增加活动产品</Button>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" columns={this.columns()} loading={activityProducts.isLoading} dataSource={activityProducts.items} />
      </div>
    );
  }
}

export const ActivityProducts = Form.create()(ActivityProductsList);
