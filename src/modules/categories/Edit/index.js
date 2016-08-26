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
    console.log(category.cId);
    this.props.form.setFieldsInitialValue({
      cid: category.cid,
      parentCid: category.parentCid,
      catPic: category.catPic,
      grade: category.grade,
      created: moment(category.created).format('YYYY-MM-DD hh:mm:ss'),
      modified: moment(category.modified).format('YYYY-MM-DD hh:mm:ss'),
    });
  }

  componentWillUnmount() {

  }

  onOkClick = (selected) => {
    const unionSuppliers = _.unionWith(this.state.suppliers, selected, _.isEqual);
    this.setState({ suppliers: unionSuppliers });
    this.toggleModalVisible();
  }

  onCloseTagClick = (e) => {
    const id = Number(e.currentTarget.parentNode.dataset.id);
    let { suppliers } = this.state;
    suppliers = _.remove(suppliers, (item) => (id !== item.id));
    this.setState({ suppliers: suppliers });
  }

  onSwitchChange = (checked) => {
    this.props.form.setFieldsValue({ lockStatus: checked });
  }

  onSubmitCliick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveCategory({
      id: params.id,
      cid: params.cid,
      parentCid: params.parentCid,
      name: params.name,
      fullName: params.fullName,
      catPic: params.catPic,
      grade: params.grade,
      isParent: params.isParent,
      sortOrder: params.sortOrder,
      status: params.status,
      create: moment(params.create).format('YYYY-MM-DD hh:mm:ss'),
      modified: moment(params.modified).format('YYYY-MM-DD hh:mm:ss'),
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
          <Form.Item {...this.formItemLayout()} label="ID">
            <Input {...getFieldProps('id', { rules: [{ required: true, message: '请输入ID！' }] })} value={getFieldValue('id')} placeholder="请输入类目ID" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类目ID">
            <Input {...getFieldProps('cid', { rules: [{ required: true, message: '请输入类目ID！' }] })} value={getFieldValue('cid')} placeholder="请输入类目ID" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="父类目ID">
            <Input {...getFieldProps('parentCid', { rules: [{ required: true, message: '请输入父类目ID！' }] })} value={getFieldValue('parentCid')} placeholder="请输入父类目ID" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="展示图片">
            <Input {...getFieldProps('catPic', { rules: [{ required: true, message: '请输入图片URL！' }] })} value={getFieldValue('catPic')} placeholder="请输入图片URL！" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类目等级">
            <Input {...getFieldProps('grade', { rules: [{ required: true, message: '请输入类目等级！' }] })} value={getFieldValue('grade')} placeholder="请输入类目等级！" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="状态" >
            <Select style={{ width: 200 }} placeholder="状态" {...getFieldProps('status') === 'normal' ? '正常' : '未使用'} value={getFieldValue('status') === 'normal' ? '正常' : '未使用'} required>
              <Option value="status">正常</Option>
              <Option value="status">未使用</Option>
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="创建时间">
            <DatePicker {...getFieldProps('created')} value={getFieldValue('created')} format="yyyy-MM-dd HH:mm:ss" showTime required />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="修改时间">
            <DatePicker {...getFieldProps('modified')} value={getFieldValue('modified')} format="yyyy-MM-dd HH:mm:ss" showTime required />
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
