import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card, Alert, Tabs } from 'antd';
import Modals from 'modules/Modals';
import { If } from 'jsx-control-statements';
import { imageUrlPrefixs } from 'constants';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchAppBanner, updateAppBanner, resetAppBanner } from 'redux/modules/appBanner/appBanner';

const actionCreators = {
  fetchAppBanner,
  updateAppBanner,
  resetAppBanner,
};

@connect(
  state => ({
    appBanner: state.appBanner,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class UpdateBanner extends Component {
  static propTypes = {
    appBanner: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchAppBanner: React.PropTypes.func,
    updateAppBanner: React.PropTypes.func,
    resetAppBanner: React.PropTypes.func,
    location: React.PropTypes.object,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props, context) {
    super(props);
    context.router;
  }
  state = {

  }
  componentWillMount() {
    this.props.fetchAppBanner(this.props.location.query.id);
  }
  componentWillReceiveProps(nextProps) {
    this.props.form.setFieldsInitialValue({
      title: nextProps.appBanner.title,
      category: nextProps.appBanner.category,
      activeTime: nextProps.appBanner.activeTime,
      isActive: nextProps.appBanner.isActive,
    });
    const { updated } = nextProps.appBanner;
    if (updated) {
      message.success('修改成功');
      this.context.router.goBack();
    }
  }
  componentWillUnmount() {
    this.props.resetAppBanner();
  }
  onSubmit = () => {
    const fieldValue = this.props.form.getFieldsValue();
    const id = this.props.location.query.id;
    const item = this.props.appBanner.item;
    this.props.updateAppBanner(id, fieldValue);
  }
  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  })
  render() {
    const self = this;
    const { getFieldProps, getFieldValue, setFieldsValue, getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form horizontal>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="标题">
                <Input {...getFieldProps('title', { rules: [{ required: true, message: 'title必须存在 !' }] })} value={getFieldValue('title')} placeholder="标题" />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="目录">
                <Select {...getFieldProps('category')} value={getFieldValue('category')} placeholder="目录!">
                  <Select.Option value="index">首页</Select.Option>
                  <Select.Option value="jingpin">精品会页面</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="是否上线">
                {getFieldDecorator('isActive', { valuePropName: 'checked' })(
                  <Switch />
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.onSubmit}>
                  提交
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export const ChangeBanner = Form.create()(UpdateBanner);
