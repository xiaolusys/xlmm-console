import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Card, Col, Tag, Row, Table, Collapse, Button, message, DatePicker, Badge } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchUserBudget, sendEnvelopUserBudget } from 'redux/modules/operations/sendEnvelopUserBudget';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Search = Input.Search;
const actionCreators = {
  fetchUserBudget,
  sendEnvelopUserBudget,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 发红包到用户小鹿钱包',
  '1. 给操作人指定的用户发送红包',
  '2. 红包金额以人民币元为单位',
  '3. 请点击查看用户后发送红包',
  '4. 提示发送成功后请核对余额是否有添加',
  '5. 备注是以django-admin loga_ction 形式添加',
  ];

@connect(
  state => ({
    sendResult: state.sendEnvelopUserBudget,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class SendUserBudget extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    fetchUserBudget: React.PropTypes.func,
    sendEnvelopUserBudget: React.PropTypes.func,
    sendResult: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'coupon-transfercoupon-elite-score',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
      loading: false,
      iconLoading: false,
      currentCustomerId: 1,
      data: {},
  }

  componentWillReceiveProps(nextProps) {
    const { sendResult } = nextProps;
    const results = sendResult.results;

    if (!isEmpty(results)) {
      if (results.code === 0) {
          message.success(results.info);
          this.setState({
                         loading: !sendResult.success,
                         iconLoading: !sendResult.success,
                         data: results.data,
         });
        this.props.form.setFieldsInitialValue({
          amount: '',
          memo: '',
        });
      } else {
          this.setState({ currentCustomerId: 1 });
          message.error(results.info);
      }
      sendResult.results = {};
    }
  }

  onInputCurrentCustomerChange = (e) => {
    const self = this;
    const currentCustomerId = e.target.value;
    this.setState({
      currentCustomerId: currentCustomerId,
    });
  }

  enterLoading = () => {
    const self = this;
    this.props.form.validateFields((errors, values) => {
        if (!!errors) {
          return;
        }
    });
    this.setState({ loading: true });
    const params = this.props.form.getFieldsValue();
    this.props.sendEnvelopUserBudget({
      amount: params.amount,
      customerId: this.state.currentCustomerId,
      memo: params.memo,
    });
  }

  fetchUserBudget = () => {
    const self = this;
    this.props.fetchUserBudget(this.state.currentCustomerId);
  }

  enterIconLoading = () => {
    const self = this;
    this.setState({ iconLoading: true });
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
  })
  render() {
    const { prefixCls, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { data } = this.state;

    return (<div>
      <Collapse defaultActiveKey={['123']} onChange={callback}>
        <Panel header="操作说明" key="123">
            {texts.map((row) => (<p>{row}</p>))}
        </Panel>
      </Collapse>
      <div className="gutter-example" style={{ marginBottom: 16, marginTop: 32 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card style={{ background: '#ECECEC', padding: '30px' }} title="用户钱包基础信息" >
              <Badge status="success" text={data.customerId} />
              <p>用户id: {data.customerId}</p>
              <p>昵称  : {data.nick}</p>
              <p>手机号: {data.mobile}</p>
              <p>钱包id: {data.id}</p>
              <p>余额  : {data.cash}元</p>
            </Card>
          </Col>
          <Col span={6}>
            <Tag color="#f50">用户id:</Tag>
            <Input style={{ width: 100 }} value={this.state.currentCustomerId} onChange={this.onInputCurrentCustomerChange} onPressEnter={this.fetchUserBudget} />
            <Button icon="search" onClick={this.fetchUserBudget} >查看钱包</Button>
          </Col>
          <Col span={10} style={{ background: '#ECECEC', padding: '30px' }}>
            <Form className={`${prefixCls}`} >
              <Form.Item {...this.formItemLayout()} label="金额:">
                <Input {...getFieldProps('amount', { rules: [{ required: true, title: '金额' }] })} value={getFieldValue('amount')} placeholder="输入您要发送的红包金额" />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="备注:">
                <Input {...getFieldProps('memo')} value={getFieldValue('memo')} />
              </Form.Item>
              <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>发送红包</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>);
    }
}

export const SendEnvelopUserBudget = Form.create()(SendUserBudget);
