import React, { Component } from 'react';
import { Form, Input, Cascader } from 'antd';
import { Qiniu } from 'components/Qiniu';

class Basic extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    product: React.PropTypes.object,
    category: React.PropTypes.object,
    supplier: React.PropTypes.object,
  };

  state = {

  }

  componentWillReceiveProps(nextProps) {
    const { product } = nextProps;
    if (product.success) {
      this.props.form.setFieldsInitialValue({
        ...product,
      });
    }
  }

  onDrop = (files, e) => {
    console.log(files, e);
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { product, category, supplier } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const token = 'M7M4hlQTLlz_wa5-rGKaQ2sh8zzTrdY8JNKNtvKN:jtnTOpgw5vtDkEs0o_yLg0q2lHA=:eyJzY29wZSI6InhpYW9sdW1tIiwiZGVhZGxpbmUiOjE0NzI3MDA3MTN9';
    return (
      <Form horizontal>
        <Form.Item {...this.formItemLayout()} label="供应商">
          <p>{supplier.supplierName}</p>
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="商品名称">
          <Input {...getFieldProps('title', { rules: [{ required: true, message: '请输入商品名称！' }] })} value={getFieldValue('title')} placeholder="请输入商品名称" />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="商品链接">
          <Input {...getFieldProps('productLink', { rules: [{ required: true, message: '请输入商品链接！' }] })} value={getFieldValue('productLink')} placeholder="请输入商品链接" />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="商品主图">
          <Qiniu token={token} onDrop={this.onDrop} />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="类目">
          <Cascader options={category} onChange={this.onCategoryChange} placeholder="请选择类目" />
        </Form.Item>
      </Form>
    );
  }

}

export const BasicForm = Form.create()(Basic);
