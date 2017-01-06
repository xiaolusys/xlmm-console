import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Col, Row, Table, Collapse, Button, message, DatePicker } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchGiftTransferCoupon, putGiftTransferCoupon } from 'redux/modules/operations/giftTransferCoupon';
const Panel = Collapse.Panel;

const FormItem = Form.Item;

const actionCreators = {
  fetchGiftTransferCoupon,
  putGiftTransferCoupon,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 更具订单赠送精品券',
  '1. 更具操作人指定用户id赠送精品精品券',
  '2. 当提示已经赠送过但是用户没有收到赠送优惠券,可以更换活动id后赠送',
  '3. 请更具用户订单数量赠送响应的精品券',
  '4. 请点击查询后再选择 点击发送赠送精品券或者取消精品券操作',
  '5. 赠送精品券时候使用title旁边的漏斗进行过滤可以更快的找到要赠送的模板类型',
  ];

@connect(
  state => ({
    giftTransferCoupon: state.giftTransferCoupon,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class GiftTransFerCoupon extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    fetchGiftTransferCoupon: React.PropTypes.func,
    putGiftTransferCoupon: React.PropTypes.func,
    giftTransferCoupon: React.PropTypes.object,
    form: React.PropTypes.object,
    saleOrders: React.PropTypes.object,
    templatesData: React.PropTypes.object,
    usercoupons: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'usercoupon-gift-transfercoupon',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
      loading: false,
      iconLoading: false,
      saleOrders: [],
      templates: [],
      templatesCopy: [],
      usercoupons: [],
      filterDropdownVisible: false,
      searchTemplateText: '',
      activityId: 1,
  }

  componentWillMount() {
    this.props.fetchGiftTransferCoupon();
    const now = new Date();
    const todayDateArry = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    const todayDate = todayDateArry.join('-');
  }

  componentWillReceiveProps(nextProps) {
    const { giftTransferCoupon } = nextProps;
    const results = giftTransferCoupon.results;

    if (!isEmpty(results)) {
      if (results.code === 0) {
          message.success(results.info);
          this.setState({
                         loading: !giftTransferCoupon.success,
                         iconLoading: !giftTransferCoupon.success,
                         saleOrders: results.data.saleOrders,
                         usercoupons: results.data.usercoupons,
                         templates: results.data.templates,
                         templatesCopy: results.data.templates,
         });
        this.props.form.setFieldsInitialValue({
          modelIds: results.data.modelIds,
          buyerId: results.data.buyerId,
          timeFrom: moment(results.data.timeFrom).format('YYYY-MM-DD HH:mm:ss'),
          timeTo: moment(results.data.timeTo).format('YYYY-MM-DD HH:mm:ss'),
        });
      } else {
          message.error(results.info);
      }
    }
  }

  onInputTemplateChange = (e) => {
    const self = this;
    this.setState({ searchTemplateText: e.target.value });
  }

  onSearchTemplate = () => {
    const self = this;
    const searchTemplateText = this.state.searchTemplateText;
    const reg = new RegExp(searchTemplateText, 'gi');
    const templatesCopy = this.state.templatesCopy;
    console.log(searchTemplateText, reg);
    if (searchTemplateText === '') {
      this.setState({ templates: templatesCopy });
    }
    this.setState({
      filterDropdownVisible: false,
      templates: templatesCopy.map((record) => {
        const match = record.title.match(reg);
        if (!match) {
          return null;
        }
        return {
          ...record,
          title: (
            <span>
              {record.title.split(reg).map((text, i) => (
                i > 0 ? [<span className="highlight">{match[0]}</span>, text] : text
              ))}
            </span>
          ),
        };
      }).filter(record => !!record),
    });
  }

  onTemplateTableChange = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter);
  }

  saleOrdersColumns = [{
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '交易id',
    dataIndex: 'saleTradeId',
    key: 'saleTradeId',
  },
    {
    title: '数量',
    dataIndex: 'num',
    key: 'num',
  },
    {
    title: '状态',
    dataIndex: 'statusDisplay',
    key: 'statusDisplay',
  },
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  ]
  usercouponsColumns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title',
  },
  {
      title: '用户id',
      dataIndex: 'customerId',
      key: 'customerId',
  },
  {
      title: '状态',
      dataIndex: 'statusDisplay',
      key: 'statusDisplay',
  },
  {
      title: '模板id',
      dataIndex: 'templateId',
      key: 'templateId',
  },
  {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
  },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'action',
      render: (id, record) => (
        <span>
          <a data-couponid={id} onClick={this.cancelBoutiqueCoupon}>取消赠券</a>
        </span>
      ),
  },
  ]

  sendBoutiqueCoupon = (e) => {
    const self = this;
    const { templateid } = e.currentTarget.dataset;
    const params = this.props.form.getFieldsValue();
    console.log('templateid', templateid, 'buyerId', params.buyerId);
    this.props.putGiftTransferCoupon({
      buyerId: params.buyerId,
      templateId: templateid,
      activityId: this.state.activityId,
    });
  }

  cancelBoutiqueCoupon = (e) => {
    const self = this;
    const { couponid } = e.currentTarget.dataset;
    console.log('取消赠券', couponid);
    this.props.putGiftTransferCoupon({
      cancelCouponId: couponid,
    });
  }

  templatesDataColumns = () => {
    const self = this;
    const x = [{
          title: 'id',
          dataIndex: 'id',
          key: 'id',
      }, {
          title: 'value',
          dataIndex: 'value',
          key: 'value',
          sorter: (a, b) => a.value - b.value,
      }, {
          title: 'title',
          dataIndex: 'title',
          key: 'title',
          filterDropdown: (
            <div className="custom-filter-dropdown">
              <Input
                placeholder="Search Template"
                value={this.state.searchTemplateText}
                onChange={this.onInputTemplateChange}
                onPressEnter={this.onSearchTemplate}
                />
              <Button type="primary" onClick={this.onSearchTemplate}>Search</Button>
            </div>
          ),
          filterDropdownVisible: this.state.filterDropdownVisible,
          onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
      },
      {
          title: 'action',
          dataIndex: 'id',
          key: 'action',
          render: (id, record) => (
            <span>
              <a data-templateid={id} onClick={self.sendBoutiqueCoupon}>赠送精品券</a>
            </span>
          ),
      },
      ];
      return x;
  }

  fetchGiftTransferCoupon = (e) => {
    this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          return;
        }
    });

    const params = this.props.form.getFieldsValue();
    console.log('params:', params);
    this.props.fetchGiftTransferCoupon({
      buyerId: params.buyerId,
      timeFrom: moment(params.timeFrom).format('YYYY-MM-DD HH:mm:ss'),
      timeTo: moment(params.timeTo).format('YYYY-MM-DD HH:mm:ss'),
      modelIds: params.modelIds,
    });
  }

  changeActivityId = (e) => {
    const self = this;
    this.state.activityId = e.target.value;
  }

  formItemLayout = () => ({
    labelCol: { span: 1 },
    wrapperCol: { span: 18 },
  })
  formItemLayout1 = () => ({
    labelCol: { span: 3 },
    wrapperCol: { span: 8 },
  })
  formItemLayout2 = () => ({
    labelCol: { span: 6 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { prefixCls, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const saleOrders = this.state.saleOrders;
    const usercoupons = this.state.usercoupons;
    const templates = this.state.templates;

    return (<div>
      <Collapse defaultActiveKey={['123']} onChange={callback}>
        <Panel header="操作说明" key="123">
            {texts.map((row) => (<p>{row}</p>))}
        </Panel>
      </Collapse>

      <Form className={`${prefixCls}`} onSubmit={this.fetchGiftTransferCoupon}>
        <div className="gutter-example" >
          <Row gutter={1}>
            <Col className="gutter-row" span={8}>
              <Form.Item {...this.formItemLayout1()} label="用户id">
                <Input {...getFieldProps('buyerId', { rules: [{ required: true, title: '用户id' }] })} value={getFieldValue('buyerId')} placeholder="用户id" />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item {...this.formItemLayout2()} label="开始时间">
                <DatePicker {...getFieldProps('timeFrom', { rules: [{ required: true }] })} value={getFieldValue('timeFrom')} format="yyyy-MM-dd HH:mm:ss" showTime required />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item {...this.formItemLayout2()} label="结束时间">
                <DatePicker {...getFieldProps('timeTo', { rules: [{ required: true }] })} value={getFieldValue('timeTo')} format="yyyy-MM-dd HH:mm:ss" showTime required />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <Form.Item {...this.formItemLayout()} label="款式id">
          <Col className="gutter-row" span={16}>
            <Input {...getFieldProps('modelIds', { rules: [{ required: true, title: '款式id' }] })} value={getFieldValue('modelIds')} placeholder="款式id" />
          </Col>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form.Item>
      </Form>
      <div className="gutter-example" style={{ marginBottom: 16, marginTop: 32 }} >
        <Row gutter={1}>
          <Col className="gutter-row" span={10}>
            <Collapse onChange={callback}>
              <Panel header="购券订单" key="saleOrders">
                <Table columns={this.saleOrdersColumns} dataSource={saleOrders} size="small" />
              </Panel>
            </Collapse>
          </Col>
          <Col className="gutter-row" span={14}>
            <Collapse onChange={callback}>
              <Panel header="用户赠送精品券" key="usercoupons">
                <Table columns={this.usercouponsColumns} dataSource={usercoupons} size="small" />
              </Panel>
            </Collapse>
          </Col>
        </Row>
      </div>

      <div className="gutter-example" style={{ marginBottom: 16, marginTop: 32 }} >
        <Row gutter={1}>
          <Col className="gutter-row" span={2}>
            <Input addonBefore="活动id" addonAfter="" defaultValue={this.state.activityId} onChange={this.changeActivityId} />
          </Col>
        </Row>
      </div>

      <Collapse onChange={callback}>
        <Panel header="精品券模板" key="templates">
          <Table columns={this.templatesDataColumns()} dataSource={templates} onChange={this.onTemplateTableChange} />
        </Panel>
      </Collapse>
    </div>);
    }
}

export const GiveTransferCoupon = Form.create()(GiftTransFerCoupon);
