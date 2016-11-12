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
import { Uploader } from 'components/Uploader';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';
import { imageUrlPrefixs } from 'constants';


const actionCreators = {
  fetchFilters,
  fetchActivity,
  saveActivity,
  resetActivity,
  fetchUptoken,
};

@connect(
  state => ({
    activity: state.activity,
    uptoken: state.uptoken,
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
    fetchUptoken: React.PropTypes.func,
    uptoken: React.PropTypes.object,
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
    this.props.fetchUptoken();
    this.props.fetchFilters();
  }


  componentWillReceiveProps(nextProps) {
    const { activity, filters } = nextProps;
    if (activity && !activity.isLoading && activity.success && activity.updated) {
      this.context.router.goBack();
    }

    if (activity && activity.success) {
      const actImg = [];
      const actLogo = [];
      const maskLink = [];
      const shareIcon = [];
      if (activity.actImg) { actImg.push({ uid: activity.actImg, url: activity.actImg, status: 'done' }); }
      if (activity.actLogo) { actLogo.push({ uid: activity.actLogo, url: activity.actLogo, status: 'done' }); }
      if (activity.maskLink) { maskLink.push({ uid: activity.maskLink, url: activity.maskLink, status: 'done' }); }
      if (activity.shareIcon) { shareIcon.push({ uid: activity.shareIcon, url: activity.shareIcon, status: 'done' }); }
      this.props.form.setFieldsInitialValue({
        id: activity.id,
        title: activity.title,
        actDesc: activity.actDesc,
        actImg: actImg,
        maskLink: maskLink,
        actLogo: actLogo,
        shareIcon: shareIcon,
        actLink: activity.actLink,
        actApplink: activity.actApplink,
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
    } else {
      this.props.form.setFieldsInitialValue({
        actImg: [],
        actLogo: [],
        maskLink: [],
        shareIcon: [],
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
    let actImg = '';
    let maskLink = '';
    let actLogo = '';
    let shareIcon = '';
    if (params.actImg.length > 0) { actImg = params.actImg[0].url; }
    if (params.maskLink.length > 0) { maskLink = params.maskLink[0].url; }
    if (params.actLogo.length > 0) { actLogo = params.actLogo[0].url; }
    if (params.shareIcon.length > 0) { shareIcon = params.shareIcon[0].url; }
    this.props.saveActivity(this.props.activity.id, {
        title: params.title,
        actDesc: params.actDesc,
        actImg: actImg,
        maskLink: maskLink,
        actLogo: actLogo,
        shareIcon: shareIcon,
        actLink: params.actLink,
        scheduleId: params.scheduleId,
        actType: this.props.form.getFieldProps('actType').value,
        startTime: moment(params.startTime).format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment(params.endTime).format('YYYY-MM-DD HH:mm:ss'),
        loginRequired: params.loginRequired,
        isActive: params.isActive,
    });
  }

  onActImgRemove = (file) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ actImg: [] });
  }

  onActImgChange = ({ fileList }) => {
    const self = this;
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ actImg: fileList });
  }

  onMaskLinkRemove = (file) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ maskLink: [] });
  }

  onMaskLinkChange = ({ fileList }) => {
    const self = this;
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ maskLink: fileList });
  }

  onActLogoRemove = (file) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ actLogo: [] });
  }

  onActLogoChange = ({ fileList }) => {
    const self = this;
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ actLogo: fileList });
  }

  onShareIconRemove = (file) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ shareIcon: [] });
  }

  onShareIconChange = ({ fileList }) => {
    const self = this;
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ shareIcon: fileList });
  }

  onActTypeSelect = (value) => {
    const self = this;
    console.log('ac type: ', value);
    this.props.form.setFieldsValue({ actType: value });
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
    const { prefixCls, activity, form, filters, uptoken } = this.props;
    console.log('filters:', filters);
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
              <Form.Item {...this.formItemLayout()} label="入口图片" help="只能上传一张，如果要替换请先删除。" >
                <Uploader
                  {...getFieldProps('actImg', {
                    valuePropName: 'fileList',
                  })}
                  onRemove={this.onActImgRemove}
                  onChange={this.onActImgChange}
                  uptoken={uptoken.token}
                  />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="弹窗图片" help="只能上传一张，如果要替换请先删除。" >
                <Uploader
                  {...getFieldProps('maskLink', {
                    valuePropName: 'fileList',
                  })}
                  onRemove={this.onMaskLinkRemove}
                  onChange={this.onMaskLinkChange}
                  uptoken={uptoken.token}
                  />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="品牌LOGO" help="只能上传一张，如果要替换请先删除。" >
                <Uploader
                  {...getFieldProps('actLogo', {
                    valuePropName: 'fileList',
                  })}
                  onRemove={this.onActLogoRemove}
                  onChange={this.onActLogoChange}
                  uptoken={uptoken.token}
                  />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="分享图标" help="只能上传一张，如果要替换请先删除。" >
                <Uploader
                  {...getFieldProps('shareIcon', {
                    valuePropName: 'fileList',
                  })}
                  onRemove={this.onShareIconRemove}
                  onChange={this.onShareIconChange}
                  uptoken={uptoken.token}
                  />
              </Form.Item>
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
