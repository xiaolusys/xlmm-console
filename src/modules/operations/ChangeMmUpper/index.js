import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Select, Icon, Form, Tabs, Collapse, Button, message } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { changeUpperMama } from 'redux/modules/operations/changeUpperMama';


const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;

const actionCreators = {
  changeUpperMama,
};

function callback(key) {
  console.log(key);
}

const texts = [
  '应用场景： 更改指定妈妈的上级妈妈',
  '1. 更具操作人指定修改推荐关系',
  '2. 如果当前妈妈没有接管则会置为接管状态',
  '3. 如果当前妈妈不是精英妈妈则会置为精英妈妈',
  '4. 更具操作人指定direct类型设置妈妈的direct类型',
  ];

@connect(
  state => ({
    changeResult: state.changeUpperMama,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class ChageMa extends TabPane {
  state = {
      loading: false,
      iconLoading: false,
      mamaId: 0,
      upperMamaId: 0,
      directInfo: '',
  }

  static propTypes = {
    changeUpperMama: React.PropTypes.func,
    changeResult: React.PropTypes.object,
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
    this.props.changeUpperMama(this.state);
  }

  enterIconLoading = () => {
    const self = this;
    this.setState({ iconLoading: true });
  }

  changeMamaId = (v) => {
    const self = this;
    this.state.mamaId = v.target.value;
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
    const { changeResult } = nextProps;
    const res = changeResult.res;
    if (!isEmpty(res)) {
      if (res.code === 0) {
          message.success(res.info);
          this.setState({
                         loading: !changeResult.success,
                         iconLoading: !changeResult.success,
                         mamaId: 0,
                         upperMamaId: 0,
                         directInfo: '',
         });
         changeResult.res = {};
      } else {
          message.error(res.info);
          changeResult.res = {};
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
      <Input addonBefore="需要修改的妈妈id" addonAfter="" defaultValue="0" onChange={this.changeMamaId} />
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
          确定更换关系
      </Button>
    </div>
  </div>);
  }
}

export const ChangeMmUpper = Form.create()(ChageMa);
