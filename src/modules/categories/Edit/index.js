import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input } from 'antd';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/category';
import _ from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    category: state.category,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditCategory extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchCategory: React.PropTypes.func,
    saveCategory: React.PropTypes.func,
    resetCategory: React.PropTypes.func,
    category: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'category-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    categories: [],
    modalVisible: false,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchCategory(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { category } = nextProps;
    if (!category.isLoading && category.success && category.updated) {
      this.context.router.goBack();
    }
    this.props.form.setFieldsInitialValue({
      parentCid: category.parentCid,
      catPic: category.catPic,
      name: category.name,
      sortOrder: category.sortOrder,
      created: moment(category.created).format('YYYY-MM-DD hh:mm:ss'),
      modified: moment(category.modified).format('YYYY-MM-DD hh:mm:ss'),
    });
  }

  componentWillUnmount() {
    this.props.resetCategory();
  }

  onSubmitCliick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveCategory(this.props.category.cid,{
      parentCid: params.parentCid,
      name: params.name,
      catPic: params.catPic,
      sortOrder: params.sortOrder,
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
    const { prefixCls, category, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { categories } = this.state;
    return (
      <div>
        <Form horizontal className={`${prefixCls}`}>
          <Form.Item {...this.formItemLayout()} label="父类目ID">
            <Input {...getFieldProps('parentCid', { rules: [{ required: true, message: '请输入父类目ID！' }] })} value={getFieldValue('parentCid')} placeholder="请输入父类目ID" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="名称">
            <Input {...getFieldProps('name', { rules: [{ required: true, message: '请输入名称！' }] })} value={getFieldValue('name')} placeholder="请输入名称" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="展示图片">
            <Input {...getFieldProps('catPic')} value={getFieldValue('catPic')} placeholder="请输入图片URL" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="权重">
            <Input {...getFieldProps('sortOrder')} value={getFieldValue('sortOrder')} placeholder="请输入权重" />
          </Form.Item>
          <Row>
            <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitCliick}>保存</Button></Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export const Edit = Form.create()(EditCategory);
