import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Table, Collapse, Button, message } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchGitfTransferCoupon } from 'redux/modules/operations/giftTransferCoupon';
const Panel = Collapse.Panel;

const FormItem = Form.Item;

const actionCreators = {
  fetchGitfTransferCoupon,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 更具订单赠送精品券',
  '1. 更具操作人指定用户id赠送精品精品券',
  '2. 当提示已经赠送过但是用户没有收到赠送优惠券,可以更换活动id后赠送',
  '3. 请更具用户订单数量赠送响应的精品券',
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
    fetchGitfTransferCoupon: React.PropTypes.func,
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
  }

  componentWillMount() {
    this.props.fetchGitfTransferCoupon();
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
    title: 'saleTradeId',
    dataIndex: 'saleTradeId',
    key: 'saleTradeId',
  },
    {
    title: 'num',
    dataIndex: 'num',
    key: 'num',
  },
    {
    title: 'status',
    dataIndex: 'status',
    key: 'status',
  },
  ]
  usercouponsColumns = [{
      title: 'title',
      dataIndex: 'title',
      key: 'title',
  },
  {
      title: 'customerId',
      dataIndex: 'customerId',
      key: 'customerId',
  },
  {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
  },
  {
      title: 'templateId',
      dataIndex: 'templateId',
      key: 'templateId',
  },
  {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
  },
  ]

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
      }];
      return x;
  }

  formItemLayout = () => ({
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
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

      <Form horizontal className={`${prefixCls}`}>
        <Form.Item {...this.formItemLayout()} label="款式id">
          <Input {...getFieldProps('modelIds', { rules: [{ required: true, title: '款式id' }] })} value={getFieldValue('modelIds')} placeholder="款式id" />
        </Form.Item>
      </Form>

      <Collapse onChange={callback}>
        <Panel header="购券订单" key="saleOrders">
          <Table columns={this.saleOrdersColumns} dataSource={saleOrders} size="small" />
        </Panel>
      </Collapse>

      <Collapse onChange={callback}>
        <Panel header="用户赠送精品券" key="usercoupons">
          <Table columns={this.usercouponsColumns} dataSource={usercoupons} size="small" />
        </Panel>
      </Collapse>

      <Collapse onChange={callback}>
        <Panel header="精品券模板" key="templates">
          <Table columns={this.templatesDataColumns()} dataSource={templates} onChange={this.onTemplateTableChange} />
        </Panel>
      </Collapse>
    </div>);
    }
}

export const GiveTransferCoupon = Form.create()(GiftTransFerCoupon);
