import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Col, Row, Table, Collapse, Button, message, DatePicker } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { sendEliteScore } from 'redux/modules/operations/sendTransferEliteScore';
const Panel = Collapse.Panel;
const FormItem = Form.Item;

const actionCreators = {
  sendEliteScore,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 赠送精品汇积分',
  '1. 给操作人指定的用户赠送精品汇积分以匹配相应的等级',
  '2. 指定等级指定用户最多赠送一次积分',
  ];

@connect(
  state => ({
    sendResult: state.sendTransferEliteScore,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class GiftTransFerCoupon extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    sendEliteScore: React.PropTypes.func,
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
      ranks: [
        { key: 'Associate', value: '经理' },
        { key: 'Director', value: '主管' },
        { key: 'VP', value: '副总裁' },
        { key: 'Partner', value: '合伙人' },
        { key: 'SP', value: '高级合伙人' },
      ],
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
         });
        this.props.form.setFieldsInitialValue({
          rank: '',
          customerId: '',
          eliteScore: '',
        });
      } else {
          message.error(results.info);
      }
    }
  }

  handleRankChange = (value) => {
    const self = this;
    this.props.form.setFieldsInitialValue({
      rank: value,
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
    console.log(params);
    this.props.sendEliteScore({
     rank: params.rank,
     customerId: params.customerId,
     eliteScore: params.eliteScore,
    });
  }

  enterIconLoading = () => {
    const self = this;
    this.setState({ iconLoading: true });
  }

  formItemLayout = () => ({
    labelCol: { span: 1 },
    wrapperCol: { span: 18 },
  })
  render() {
    const { prefixCls, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;

    return (<div>
      <Collapse defaultActiveKey={['123']} onChange={callback}>
        <Panel header="操作说明" key="123">
            {texts.map((row) => (<p>{row}</p>))}
        </Panel>
      </Collapse>

      <Form className={`${prefixCls}`} >
        <Form.Item {...this.formItemLayout()} label="用户id:">
          <Input {...getFieldProps('customerId', { rules: [{ required: true, title: '用户id' }] })} value={getFieldValue('customerId')} placeholder="需要赠送的用户id" />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="等级:" >
          <Select style={{ width: '32%' }} onChange={this.handleRankChange} >
            {this.state.ranks.map((rank) => (<Option value={rank.key}>{rank.value}</Option>))}
          </Select>
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="积分:">
          <Input {...getFieldProps('eliteScore', { rules: [{ required: true, title: '积分' }] })} value={getFieldValue('eliteScore')} placeholder="输入您要赠送的积分数值" />
        </Form.Item>
        <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>
          赠送积分
        </Button>
      </Form>
    </div>);
    }
}

export const SendEliteScore = Form.create()(GiftTransFerCoupon);
