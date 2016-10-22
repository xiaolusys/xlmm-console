import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input } from 'antd';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/ninePic/ninepic';
import _ from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    ninepic: state.ninepic,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditNinepic extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchNinepic: React.PropTypes.func,
    saveNinepic: React.PropTypes.func,
    resetNinepic: React.PropTypes.func,
    ninepic: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'ninepic-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    ninepics: [],
    modalVisible: false,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchNinepic(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ninepic } = nextProps;
    if (!ninepic.isLoading && ninepic.success && ninepic.updated) {
      this.context.router.goBack();
    }
    this.props.form.setFieldsInitialValue({
      id: ninepic.id,
      title: ninepic.title,
      auther: ninepic.auther,
      cateGory: ninepic.cateGory,
      description: ninepic.description,
      created: moment(ninepic.created).format('YYYY-MM-DD hh:mm:ss'),
      modified: moment(ninepic.modified).format('YYYY-MM-DD hh:mm:ss'),
    });
  }

  componentWillUnmount() {
    this.props.resetNinepic();
  }

  onSubmitCliick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveNinepic(this.props.ninepic.cid, {
      auther: params.auther,
      title: params.title,
      description: params.description,
      cateGory: params.cateGory,
    });
  }

  toggleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { prefixCls, ninepic, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { ninepics } = this.state;
    return (
      <div>
        <Form horizontal className={`${prefixCls}`}>
          <Form.Item {...this.formItemLayout()} label="标题">
            <Input {...getFieldProps('title', { rules: [{ required: true, title: '请输入名称！' }] })} value={getFieldValue('title')} placeholder="推送标题" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="开始时间">
            <DatePicker {...getFieldProps('startTime')} value={getFieldValue('startTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="描述">
            <Input {...getFieldProps('description')} value={getFieldValue('description')} placeholder="推送描述内容" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类别">
            <Input {...getFieldProps('cateGory')} value={getFieldValue('cateGory')} placeholder="推送的产品类别" />
          </Form.Item>
          <Row>
            <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitCliick}>保存</Button></Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export const Edit = Form.create()(EditNinepic);
