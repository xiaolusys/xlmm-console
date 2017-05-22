import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Collapse, Button, message } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { createMama } from 'redux/modules/operations/createMama';


const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const actionCreators = {
  createMama,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 将一个客户更改为小鹿妈妈',
  '1. 根据操作人customer id创建小鹿妈妈信息',
  '2. 如果当前妈妈没有接管则会置为接管状态',
  '3. 当前妈妈置为精英妈妈',
  '4. 指定direct类型设置妈妈的direct类型',
  ];

@connect(
  state => ({
    createResult: state.createMama,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class CreateMama extends TabPane {
  state = {
      loading: false,
      iconLoading: false,
      customerId: 0,
      upperMamaId: 0,
      directInfo: '',
  }

  static propTypes = {
    createMama: React.PropTypes.func,
    createResult: React.PropTypes.object,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'xiaolumama-changeuppermama',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  enterLoading = () => {
    const self = this;
    this.setState({ loading: true });
    this.props.createMama(this.state);
  }

  enterIconLoading = () => {
    const self = this;
    this.setState({ iconLoading: true });
  }

  changeCustomerId = (v) => {
    const self = this;
    this.state.customerId = v.target.value;
  }

  changeUpperMamaId = (v) => {
    const self = this;
    this.state.upperMamaId = v.target.value;
  }

  changeDirect = (value, option) => {
    const self = this;
    this.state.directInfo = value;
  }

  componentWillReceiveProps(nextProps) {
    const { createResult } = nextProps;
    const res = createResult.res;
    if (!isEmpty(res)) {
      if (res.code === 0) {
          message.success(res.info);
          this.setState({
                         loading: !createResult.success,
                         iconLoading: !createResult.success,
                         customerId: 0,
                         upperMamaId: 0,
                         directInfo: '',
         });
         createResult.res = {};
      } else {
          message.error(res.info);
          createResult.res = {};
      }
    }
  }

  render() {
  return (<div>
    <Collapse defaultActiveKey={['123']} onChange={callback}>
      <Panel header="操作说明" key="123">
          {texts.map((row) => (<p>{row}</p>))}
      </Panel>
    </Collapse>

    <div style={{ marginBottom: 16, marginTop: 32 }}>
      <Input addonBefore="需要修改的customer id" addonAfter="" defaultValue="0" onChange={this.changeCustomerId} />
    </div>
    <div style={{ marginBottom: 16, marginTop: 32 }}>
      <Input addonBefore="上级妈妈id" addonAfter="" defaultValue="0" onChange={this.changeUpperMamaId} />
    </div>
    <div style={{ marginBottom: 16, marginTop: 32 }}>
      direct类型:
      <Select size="large" defaultValue="" style={{ width: 200 }} onSelect={this.changeDirect}>
        <Option value="DIRECT">DIRECT</Option>
        <Option value="INDIRECT">INDIRECT</Option>
      </Select>
      <Button type="primary" loading={this.state.loading} onClick={this.enterLoading}>
          创建精英妈妈
      </Button>
    </div>
  </div>);
  }
}

export const CreateXiaoluMama = Form.create()(CreateMama);
