import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, Col, Form, Input, Cascader, Row, Select } from 'antd';
import { fetchSku } from 'redux/modules/supplyChain/sku';
import { isEmpty } from 'lodash';
import { Uploader } from 'components/Uploader';
import { replaceAllKeys } from 'utils/object';

const actionCreators = {
  fetchSku: fetchSku,
};

@connect(
  state => ({
    sku: state.sku,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class Basic extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    product: React.PropTypes.object,
    categories: React.PropTypes.object,
    supplier: React.PropTypes.object,
    sku: React.PropTypes.array,
    fetchSku: React.PropTypes.func,
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

  }

  onCategoryChange = (values) => {
    let catgoryId = values[values.length - 1].split('-');
    catgoryId = catgoryId[catgoryId.length - 1];
    this.props.fetchSku(catgoryId);
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { product, categories, supplier, sku } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;

    const uploaderProps = {
      token: 'M7M4hlQTLlz_wa5-rGKaQ2sh8zzTrdY8JNKNtvKN:jtnTOpgw5vtDkEs0o_yLg0q2lHA=:eyJzY29wZSI6InhpYW9sdW1tIiwiZGVhZGxpbmUiOjE0NzI3MDA3MTN9',
      onDrop: this.onDrop,
      multiple: false,
      fileList: product.picUrl ? [{
        src: product.picUrl,
      }] : [],
    };
    let options = replaceAllKeys(categories.items, 'name', 'label');
    options = replaceAllKeys(options, 'cid', 'value');
    return (
      <div>
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
            <Uploader {...uploaderProps} />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类目">
            <Cascader onChange={this.onCategoryChange} options={options} placeholder="请选择类目" />
          </Form.Item>
        </Form>
      </div>
    );
  }

}

export const BasicForm = Form.create()(Basic);
