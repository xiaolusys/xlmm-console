import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input } from 'antd';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/products/modelProduct';
import _ from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    modelproduct: state.modelproduct,
    category: state.category,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditModelProduct extends Component {
  static propTypes = {
    category: React.PropTypes.object,
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchModelProduct: React.PropTypes.func,
    saveModelProduct: React.PropTypes.func,
    resetModelProduct: React.PropTypes.func,
    modelProduct: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'modelproduct-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    modelProducts: [],
    modalVisible: false,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchModelProduct(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { modelproduct } = nextProps;
    // if (!modelproduct.isLoading && modelproduct.success && modelproduct.updated) {
    //  this.context.router.goBack();
    // }
    // this.props.form.setFieldsInitialValue({
    //  parentCid: modelproduct.parentCid,
    //  catPic: category.catPic,
    //  name: category.name,
    //  sortOrder: category.sortOrder,
    //  created: moment(category.created).format('YYYY-MM-DD hh:mm:ss'),
    //  modified: moment(category.modified).format('YYYY-MM-DD hh:mm:ss'),
    // });
  }

  componentWillUnmount() {
    this.props.resetModelProduct();
  }

  onSubmitCliick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
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
    const { modelproduct } = this.state;
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

export const Edit = Form.create()(EditModelProduct);
