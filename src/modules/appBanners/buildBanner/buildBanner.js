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
import { createAppBanner, resetAppBanner } from 'redux/modules/appBanner/appBanner';


const actionCreators = {
  createAppBanner,
  resetAppBanner,
};

@connect(
  state => ({
    appBanner: state.appBanner,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class CreateBanner extends Component {
  static propTypes = {
    appBanner: React.PropTypes.object,
    form: React.PropTypes.object,
    createAppBanner: React.PropTypes.func,
    resetAppBanner: React.PropTypes.func,
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
  }
  componentWillReceiveProps(nextProps) {
    const { create } = nextProps.appBanner;
    if (create) {
      message.success('创建成功');
      this.context.router.goBack();
    }
  }

  componentWillUnmount() {
    this.props.resetAppBanner();
  }
  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  })

  handleSelectChange = () => {
    const self = this;
    return {
      re: 1231,
    };
  }
  submitBanner = () => {
    const a = this.props.form.getFieldsValue();
    a.activeTime = a.activeTime.format('YYYY-MM-DD HH:mm:ss');
    if (!a.isActive) {
      a.isActive = false;
    }
    this.props.createAppBanner({ title: a.title, activeTime: a.activeTime, isActive: a.isActive, category: a.category });
  }

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
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="上线时间">
                {getFieldDecorator('activeTime')(
                  <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="目录">
                {getFieldDecorator('category', {
                  rules: [{ required: true, message: '选择目录' }],
                  onChange: this.handleSelectChange,
                })(
                  <Select placeholder="Select a option and change input text above">
                    <Option value="index">首页</Option>
                    <Option value="jingpin">精品会页面</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
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
                  onClick={this.submitBanner}>
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

export const BuildBanner = Form.create()(CreateBanner);
