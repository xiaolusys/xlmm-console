import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { isEmpty, includes } from 'lodash';
import { fetchPreference } from 'redux/modules/supplyChain/preference';


const actionCreators = {
  fetchPreference,
};

@connect(
  state => ({
    preference: state.preference,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class Material extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    preference: React.PropTypes.object,
    fetchPreference: React.PropTypes.func,
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
    this.props.fetchPreference();
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
  })

  formItem = (item) => {
    const { getFieldProps, getFieldValue } = this.props.form;
    console.log(item);
    return (
      <Form.Item {...this.formItemLayout()} label={item.name}>
        <If condition={isEmpty(item.values)} >
          <Input
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请输入${item.name}!` }] })}
            value={getFieldValue(item.name)}
            placehplder={`请输入${item.name}!`}
            />
        </If>
        <If condition={!isEmpty(item.values)} >
          <Select
            {...getFieldProps(item.name, { rules: [{ required: true, message: `请输入${item.name}!` }] })}
            value={getFieldValue(item.name)}
            placehplder={`请输入${item.name}!`}
            allowClear>
            {item.values.map((value) => (<Select.Option value={value}>{value}</Select.Option>))}
          </Select>
        </If>
      </Form.Item>
    );
  }

  render() {
    const { preference } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue } = this.props.form;
    return (
      <Form>
        <Form.Item {...this.formItemLayout()} label="资料">
          <Select
            {...getFieldProps('materials', { rules: [{ required: true, message: '请选择要录入的资料！' }] })}
            value={getFieldValue('materials')}
            allowClear
            showSearch
            multiple>
            {preference.items.map((item) => (<Select.Option value={item.id}>{item.name}</Select.Option>))}
          </Select>
        </Form.Item>
        {preference.items.map((item) => {
          if (includes(getFieldValue('materials'), item.id)) {
            return this.formItem(item);
          }
          return null;
        })}
      </Form>
    );
  }
}


export const MaterialForm = Form.create()(Material);
