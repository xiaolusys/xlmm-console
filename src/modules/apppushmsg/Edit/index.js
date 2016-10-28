import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card } from 'antd';
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
  }

  componentWillMount() {
    const { filters } = this.props;
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchAppPushMsg(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { apppushmsg } = nextProps;
    if (apppushmsg && !apppushmsg.isLoading && apppushmsg.success && apppushmsg.updated) {
      this.context.router.goBack();
    }
    if (apppushmsg && apppushmsg.success) {
      console.log('debug apppushmsg:', apppushmsg);
      this.props.form.setFieldsInitialValue({
        desc: apppushmsg.desc,
        targetUrl: apppushmsg.targetUrl,
        paramsUrl: apppushmsg.paramsUrl,
        cat: apppushmsg.cat,
        platform: apppushmsg.platform,
        regid: apppushmsg.regid,
        status: apppushmsg.status,
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
    console.log('this this.props', this.props, params);
    this.props.saveAppPushMsg(this.props.apppushmsg.id, {
        desc: params.desc,
        targetUrl: params.targetUrl,
        paramsUrl: params.paramsUrl,
        cat: params.cat,
        platform: params.platform,
        status: params.status,
        pushTime: moment(params.pushTime).format('YYYY-MM-DD HH:mm:ss'),
    });
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
              <Form.Item {...this.formItemLayout()} label="跳转界面">
                <Select {...getFieldProps('targetUrl')} value={getFieldValue('targetUrl')} placeholder="RedirectPage Choose ...">
                  {filters.targetUrl.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="跳转Url">
                <Input {...getFieldProps('paramsUrl')} value={getFieldValue('paramsUrl')} type="textarea" rows={7} laceholder="跳转Url" />
              </Form.Item>
              <Row>
                <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export const Edit = Form.create()(Editapppushmsg);
