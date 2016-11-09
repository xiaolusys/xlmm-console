import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Checkbox, Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card, Alert } from 'antd';
import Modals from 'modules/Modals';
import { fetchActivity, saveActivity, resetActivity } from 'redux/modules/activity/activity';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/activity/activityFilters';


const actionCreators = {
  fetchFilters,
  fetchActivity,
  saveActivity,
  resetActivity,
};

@connect(
  state => ({
    activity: state.activity,
    filters: state.activityFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class Editactivity extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchActivity: React.PropTypes.func,
    fetchFilters: React.PropTypes.func,
    filters: React.PropTypes.object,
    saveActivity: React.PropTypes.func,
    resetActivity: React.PropTypes.func,
    activity: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activity-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    activitys: [],
    modalVisible: false,
    theParamsVisible: 0,
    oldParamsVisible: true,
    actLinkInputVisible: false,
    scheduleIdInputVisible: false,
  }

  componentWillMount() {
    const { filters } = this.props;
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchActivity(id);
    }
    this.props.fetchFilters();
  }


  componentWillReceiveProps(nextProps) {
    const { activity, filters } = nextProps;
    if (activity && !activity.isLoading && activity.success && activity.updated) {
      this.context.router.goBack();
    }

    if (activity && activity.success) {
      this.props.form.setFieldsInitialValue({
        title: activity.title,
        actDesc: activity.actDesc,
        actImg: activity.actImg,
        actLogo: activity.actLogo,
        actLink: activity.actLink,
        maskLink: activity.maskLink,
        actApplink: activity.actApplink,
        shareIcon: activity.shareIcon,
        scheduleId: activity.scheduleId,
        shareLink: activity.shareLink,
        actType: activity.actType,
        actTypeDisplay: activity.actTypeDisplay,
        startTime: moment(activity.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(activity.endTime).format('YYYY-MM-DD HH:mm:ss'),
        orderVal: activity.orderVal,
        loginRequired: activity.loginRequired,
        loginRequiredDisplay: activity.loginRequiredDisplay,
        isActive: activity.isActive,
        isActiveDisplay: activity.isActiveDisplay,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetActivity();
  }

  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveActivity(this.props.activity.id, {
    });
  }

  onActTypeSelect = (value) => {
    const self = this;
    console.log('ac type: ', value);
    if (value === 'topic') {
      this.setState({ actLinkInputVisible: false });
      this.setState({ scheduleIdInputVisible: true });
    } else {
      this.setState({ actLinkInputVisible: true });
      this.setState({ scheduleIdInputVisible: false });
    }
  }
  onScheduleSelect = (value) => {
    const self = this;
    const { filters } = this.props;
    for (let i = 0; i < filters.schedules.length; i++) {
      if (filters.schedules[i].id === value) {
        console.log(filters.schedules[i], value);
        this.props.form.setFieldsValue({
        startTime: moment(filters.schedules[i].upshelfTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(filters.schedules[i].offshelfTime).format('YYYY-MM-DD HH:mm:ss'),
      });
      }
    }
  }
  inputActLink = () => {
    const { actLinkInputVisible } = this.state;
    if (actLinkInputVisible) {
      return (
        <Form.Item {...this.formItemLayout()} label="活动链接">
          <Input />
        </Form.Item>
        );
    }
    return (
      <div></div>
      );
  }

  inputSchedule = () => {
    const self = this;
    const { scheduleIdInputVisible } = this.state;
    const { form, filters } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    if (scheduleIdInputVisible) {
      return (
        <Form.Item {...this.formItemLayout()} label="专题排期">
          <Select {...getFieldProps('scheduleId')} onSelect={this.onScheduleSelect} value={getFieldValue('scheduleId')}>
            {filters.schedules.map((item) => (<Select.Option value={item.id}>ID: {item.id} | {item.upshelfTime} - {item.offshelfTime}</Select.Option>))}
          </Select>
        </Form.Item>
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
    const { prefixCls, activity, form, filters } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { activitys } = this.state;
    return (
      <div>
        <Row>
          <Col span={18}>
            <Form horizontal className={`${prefixCls}`}>
              <Form.Item {...this.formItemLayout()} label="标题">
                <Input {...getFieldProps('title', { rules: [{ required: true, title: '标题' }] })} value={getFieldValue('title')} />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="活动类型">
                <Select {...getFieldProps('actTypeDisplay', { rules: [{ required: true }] })} onSelect={this.onActTypeSelect} value={getFieldValue('actTypeDisplay')}>
                  {filters.actType.map((item) => (<Select.Option value={item.value}>{item.name}</Select.Option>))}
                </Select>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="开始时间">
                <DatePicker {...getFieldProps('startTime', { rules: [{ required: true }] })} value={getFieldValue('startTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="结束时间">
                <DatePicker {...getFieldProps('endTime', { rules: [{ required: true }] })} value={getFieldValue('endTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="内容描述">
                <Input {...getFieldProps('actDesc')} value={getFieldValue('actDesc')} type="textarea" rows={7} />
              </Form.Item>
              {this.inputActLink()}
              {this.inputSchedule()}
              <Checkbox {...getFieldProps('isActive')} checked={getFieldValue('isActive')}>是否上线</Checkbox>
              <Checkbox {...getFieldProps('loginRequired')} checked={getFieldValue('loginRequired')}>是否需要登陆</Checkbox>
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

export const Edit = Form.create()(Editactivity);
