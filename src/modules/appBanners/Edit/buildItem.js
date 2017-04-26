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
import { updateAppBanner, resetAppBanner, fetchAppBanner } from 'redux/modules/appBanner/appBanner';

const actionCreators = {
  updateAppBanner,
  resetAppBanner,
  fetchAppBanner,
};

@connect(
  state => ({
    appBanner: state.appBanner,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class BuildPicItem extends Component {
  static propTypes = {
    appBanner: React.PropTypes.object,
    form: React.PropTypes.object,
    updateAppBanner: React.PropTypes.func,
    resetAppBanner: React.PropTypes.func,
    fetchAppBanner: React.PropTypes.func,
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
    const id = this.props.location.query.id;
    this.props.fetchAppBanner(id);
  }
  componentWillReceiveProps(nextProps) {
    const { updated } = nextProps.appBanner;
    if (updated) {
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
  submitItem = () => {
    const fieldValue = this.props.form.getFieldsValue();
    const id = this.props.location.query.id;
    const item = this.props.appBanner.item;
    item.push(fieldValue);
    const items = { items: item };
    this.props.updateAppBanner(id, items);
  }
  render() {
    const self = this;
    const { getFieldProps, getFieldValue, setFieldValue, getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form horizontal>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="图片链接">
                <Input
                  {...getFieldProps('picLink', { rules: [{ required: true, message: '链接必须存在' }] })}
                  value={getFieldValue('picLink')}
                  placeholder="图片链接"
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                {...this.formItemLayout()}
                label="跳转链接">
                <Input
                  {...getFieldProps('itemLink', { rules: [{ required: true, message: '跳转链接必须存在' }] })}
                  value={getFieldValue('itemLink')}
                  placeholder="跳转链接"
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="APP链接">
                <Input
                  {...getFieldProps('appLink', { rules: [{ required: true, message: 'APP链接必须存在' }] })}
                  value={getFieldValue('appLink')}
                  placeholder="APP链接"
                  />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={this.submitItem}>
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

export const BuildItem = Form.create()(BuildPicItem);
