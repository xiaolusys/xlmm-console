import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Card, Col, Tag, Row, Table, Collapse, Button, message, DatePicker, Badge } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchXiaoluCoin, giveXiaoluCoin } from 'redux/modules/operations/giveXiaoluCoin';
const Panel = Collapse.Panel;
const FormItem = Form.Item;
const Search = Input.Search;
const actionCreators = {
  fetchXiaoluCoin,
  giveXiaoluCoin,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 发币到用户小鹿币帐户',
  '1. 给操作人指定的妈妈发送币',
  '2. 币金额以人民币元为单位',
  '3. 请点击查看用户后发送红包',
  '4. 提示发送成功后请核对余额是否有添加',
  '5. 备注是添加操作记录到后台',
  ];

@connect(
  state => ({
    xiaoluCoin: state.giveXiaoluCoin,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class GiftXiaoluCoin extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    fetchXiaoluCoin: React.PropTypes.func,
    giveXiaoluCoin: React.PropTypes.func,
    xiaoluCoin: React.PropTypes.object,
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
      currentMamaId: 1,
  }

  componentWillReceiveProps(nextProps) {
    const { xiaoluCoin } = nextProps;
    const results = xiaoluCoin.results;

    if (this.props.xiaoluCoin.isLoading && !xiaoluCoin.isLoading) {
      if (xiaoluCoin.success) {
          message.success('获取妈妈信息成功');
          this.setState({
                         loading: xiaoluCoin.isLoading,
                         iconLoading: xiaoluCoin.isLoading,
         });
        this.props.form.setFieldsInitialValue({
          amount: '',
          memo: '',
        });
      } else {
          this.setState({ currentMamaId: 1 });
          message.error('获取妈妈信息失败');
      }
    }

    if (!xiaoluCoin.isLoading) {
      this.setState({
                     loading: xiaoluCoin.isLoading,
                     iconLoading: xiaoluCoin.isLoading,
         });
    }

  }

  onInputCurrentCustomerChange = (e) => {
    const self = this;
    const currentMamaId = e.target.value;
    this.setState({
      currentMamaId: currentMamaId,
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

    this.props.giveXiaoluCoin({
      amount: (Number(params.amount) * 100).toString(),
      mama_id: this.state.currentMamaId,
      subject: 'gift',
      referal_id: '',
    });
  }

  fetchUserBudget = () => {
    const self = this;
    this.props.fetchXiaoluCoin(this.state.currentMamaId);
  }

  enterIconLoading = () => {
    const self = this;
    this.setState({ iconLoading: true });
  }

  formItemLayout = () => ({
    labelCol: { span: 3 },
    wrapperCol: { span: 6 },
  })
  render() {
    const { prefixCls, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { results } = this.props.xiaoluCoin;

    return (<div>
      <Collapse defaultActiveKey={['123']} onChange={callback}>
        <Panel header="操作说明" key="123">
            {texts.map((row) => (<p>{row}</p>))}
        </Panel>
      </Collapse>
      <div className="gutter-example" style={{ marginBottom: 16, marginTop: 32 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Card style={{ background: '#ECECEC', padding: '30px' }} title="妈妈小鹿币信息" >
              <Badge status="success" text={results ? results.mamaId : ''} />
              <p>mamaid: {results ? results.mamaId : ''}</p>
              <p>余额  : {results ? results.balance / 100 : 0}元</p>
            </Card>
          </Col>
          <Col span={6}>
            <Tag color="#f50">妈妈id:</Tag>
            <Input style={{ width: 100 }} value={this.state.currentMamaId} onChange={this.onInputCurrentCustomerChange} onPressEnter={this.fetchUserBudget} />
            <Button icon="search" onClick={this.fetchUserBudget} >查看币账户</Button>
          </Col>
          <Col span={10} style={{ background: '#ECECEC', padding: '30px' }}>
            <Form className={`${prefixCls}`} >
              <Form.Item {...this.formItemLayout()} label="金额(元):">
                <Input {...getFieldProps('amount', { rules: [{ required: true, title: '金额' }] })} value={getFieldValue('amount')} placeholder="输入您要发送的币金额" />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="备注:">
                <Input {...getFieldProps('memo')} value={getFieldValue('memo')} />
              </Form.Item>
              <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>发送币</Button>
            </Form>
          </Col>
        </Row>
      </div>
    </div>);
    }
}

export const GiveXiaoluCoin = Form.create()(GiftXiaoluCoin);
