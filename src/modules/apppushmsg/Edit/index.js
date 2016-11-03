import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card, Alert } from 'antd';
import Modals from 'modules/Modals';
import { fetchAppPushMsg, saveAppPushMsg, resetAppPushMsg } from 'redux/modules/appPushMsg/apppushmsg';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/appPushMsg/apppushmsgFilters';


const actionCreators = {
  fetchFilters,
  fetchAppPushMsg,
  saveAppPushMsg,
  resetAppPushMsg,
};

@connect(
  state => ({
    apppushmsg: state.apppushmsg,
    filters: state.apppushmsgFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class Editapppushmsg extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchAppPushMsg: React.PropTypes.func,
    fetchFilters: React.PropTypes.func,
    filters: React.PropTypes.object,
    saveAppPushMsg: React.PropTypes.func,
    resetAppPushMsg: React.PropTypes.func,
    apppushmsg: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'apppushmsg-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    apppushmsgs: [],
    modalVisible: false,
    theParamsVisible: 0,
    oldParamsVisible: true,

    paramsModelId: null,
    paramsIsNative: null,
    paramsUrl: null,
    paramsActivityId: null,
    paramsCid: null,
  }

  componentWillMount() {
    const { filters } = this.props;
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchAppPushMsg(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { apppushmsg, filters } = nextProps;
    if (apppushmsg && !apppushmsg.isLoading && apppushmsg.success && apppushmsg.updated) {
      this.context.router.goBack();
    }
    if (apppushmsg && apppushmsg.success) {
      this.props.form.setFieldsInitialValue({
        desc: apppushmsg.desc,
        targetUrl: apppushmsg.targetUrl,
        paramsInfo: apppushmsg.paramsInfo,
        cat: apppushmsg.cat,
        platform: apppushmsg.platform,
        regid: apppushmsg.regid,
        status: apppushmsg.status,
        statusDisplay: apppushmsg.statusDisplay,
        pushTime: moment(apppushmsg.pushTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  }

  componentWillUnmount() {
    this.props.resetAppPushMsg();
  }

  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveAppPushMsg(this.props.apppushmsg.id, {
        desc: params.desc,
        targetUrl: params.targetUrl,
        cat: params.cat,
        platform: params.platform,
        pushTime: moment(params.pushTime).format('YYYY-MM-DD HH:mm:ss'),
        paramsModelId: this.state.paramsModelId,
        paramsIsNative: this.state.paramsIsNative,
        paramsUrl: this.state.paramsUrl,
        paramsActivityId: this.state.paramsActivityId,
        paramsCid: this.state.paramsCid,
    });
  }

  onTargetUrlSelect = (value) => {
    const self = this;
    this.setState({ theParamsVisible: value });
    this.setState({ oldParamsVisible: false });
  }

  setParamsPanal = () => {
    const self = this;
    const { filters, apppushmsg } = this.props;
    const { theParamsVisible } = this.state;
    const hasParamsValue = [5, 9, 15, 16];
    const hiddenParamsValue = [1, 2, 3, 4, 8, 10, 11, 12, 13, 14];
    if (filters && filters.paramsKvs && hasParamsValue.indexOf(theParamsVisible) >= 0) {
      const paramsKvs = filters.paramsKvs[theParamsVisible];
      if (paramsKvs) {
        return (
          <div>
            <Alert message="请更具所选的跳转的界面填写以下参数！！！" type="warning" closable />
            {paramsKvs.map((paramsKv) => (<div>{this.selectParams(paramsKv)}</div>))}
          </div>
          );
      }
    }
    return (
      <div></div>
      );
  }

  selectParamsValue = (value) => {
    const self = this;
    const stateFieldName = value.label[0];
    const stateFieldValue = value.key;
    if (stateFieldName === 'is_native') {
      this.setState({ paramsIsNative: stateFieldValue });
    }
    if (stateFieldName === 'cid') {
      this.setState({ paramsCid: stateFieldValue });
    }
    if (stateFieldName === 'activity_id') {
      this.setState({ paramsActivityId: stateFieldValue });
    }
    if (stateFieldName === 'url') {
      this.setState({ paramsUrl: stateFieldValue });
    }
  }

  inputParamsValue = (e) => {
    const value = e.target.value;
    const reg = /^-?\d*\.?\d*$/;
    if (reg.test(value)) {
      this.setState({ paramsModelId: value });
    } else {
      this.setState({ paramsUrl: value });
    }
  }

  selectParams = (paramsKv) => {
    const self = this;
    if (paramsKv.value.length > 0) {
      return (
        <div>
          <Tag color="blue">{paramsKv.name}</Tag>
          <Select style={{ width: 360 }} labelInValue onSelect={this.selectParamsValue}>
            {paramsKv.value.map((item) => (<Select.Option value={item.value}>{paramsKv.key} : {item.name}</Select.Option>))}
          </Select>
        </div>
        );
    }
    return (
      <div>
        <Tag color="blue">{paramsKv.name}</Tag>
        <Input placeholder={paramsKv.name} onChange={this.inputParamsValue} />
      </div>
    );
  }

  paramsDiv = () => {
    const paramsInfo = this.props.form.getFieldValue('paramsInfo');
    if (paramsInfo && this.state.oldParamsVisible) {
      return (
        <div>
          {paramsInfo.map((item) => (
            <Form.Item {...this.formItemLayout()} label={item.name}>
              <a>{item.value}</a>
            </Form.Item>))}
        </div>
        );
    }
    return (
      <div></div>
      );
  }

  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  })

  render() {
    const { prefixCls, apppushmsg, form, filters } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { apppushmsgs } = this.state;
    return (
      <div>
        <Row>
          <Col span={10}>
            <Form horizontal className={`${prefixCls}`}>
              <Form.Item {...this.formItemLayout()} label="推送内容">
                <Input {...getFieldProps('desc', { rules: [{ required: true, title: '推送内容' }] })} value={getFieldValue('desc')} type="textarea" rows={7} laceholder="推送内容" />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="推送时间">
                <DatePicker {...getFieldProps('pushTime', { rules: [{ required: true, title: '推送时间' }] })} value={getFieldValue('pushTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="推送对象">
                <Select {...getFieldProps('platform')} value={getFieldValue('platform')} placeholder="Platform Choose ...">
                  {filters.platform.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="推送状态">
                <Input {...getFieldProps('statusDisplay')} value={getFieldValue('statusDisplay')} disabled="true" />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="跳转界面">
                <Select {...getFieldProps('targetUrl')} value={getFieldValue('targetUrl')} placeholder="RedirectPage Choose ..." onSelect={this.onTargetUrlSelect} >
                  {filters.targetUrl.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
                </Select>
              </Form.Item>
              {this.paramsDiv()}
              <Row>
                <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
              </Row>
            </Form>
          </Col>
          <Col span={8}>
            {this.setParamsPanal()}
          </Col>
        </Row>
      </div>
    );
  }
}

export const Edit = Form.create()(Editapppushmsg);
