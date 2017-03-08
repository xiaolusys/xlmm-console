import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Alert, Button, Col, Form, Icon, Input, Row, Select, Table, message } from 'antd';
import { Uploader } from 'components/Uploader';
import { each, isEmpty, groupBy, map } from 'lodash';
import { imageUrlPrefixs } from 'constants';
import { updateProduct } from 'redux/modules/supplyChain/product';
import { updateMaterial } from 'redux/modules/supplyChain/material';

const actionCreators = {
  updateProduct,
  updateMaterial,
};

@connect(
  state => ({}),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Pictures extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    product: React.PropTypes.object,
    material: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    updateProduct: React.PropTypes.func,
    updateMaterial: React.PropTypes.func,
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
    this.amountProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.amountProps(nextProps);
  }

  onRemove = (file) => {
    const { setFieldsValue, getFieldsValue } = this.props.form;
    const fieldsValue = getFieldsValue();
    map(fieldsValue, (values, field) => {
      const items = [];
      each(values, (value) => {
        if (file.uid !== value.uid) {
          items.push(value);
        }
      });
      setFieldsValue({
          [field]: items,
      });
    });
  }

  onSaveClick = () => {
    const { getFieldsValue, getFieldValue } = this.props.form;
    const { productId } = this.props.location.query;
    if (isEmpty(getFieldValue('mainPic'))) {
      message.error('请上传主图');
      return;
    }
    if (isEmpty(getFieldValue('detailPics'))) {
      message.error('请上传详情图');
      return;
    }
    const fieldsValue = getFieldsValue();
    const { product } = this.props;
    let mainPic = '';
    const detailPics = [];
    const skuExtras = [];
    if (getFieldValue('mainPic')[0].response) {
      mainPic = `${imageUrlPrefixs}${getFieldValue('mainPic')[0].response.key}`;
    } else {
      mainPic = getFieldValue('mainPic')[0].url;
    }

    each(getFieldValue('detailPics'), (file) => {
      if (file.response) {
        detailPics.push(`${imageUrlPrefixs}${file.response.key}`);
      } else {
        detailPics.push(file.url);
      }
    });
    each(product.skuExtras, (sku) => {
      const file = getFieldValue(sku.color) && getFieldValue(sku.color)[0];
      if (file) {
        if (file.response) {
          sku.picPath = `${imageUrlPrefixs}${file.response.key}`;
        } else {
          sku.picPath = file.url;
        }
        skuExtras.push(sku);
      } else {
        message.error(`请上传头图（${sku.color}）`);
      }
    });
    if (isEmpty(skuExtras)) {
      return;
    }
    this.props.updateMaterial({
      saleproductId: productId,
      contentImgs: detailPics,
      headImgs: mainPic,
    });
    this.props.updateProduct(productId, {
      skuExtras: skuExtras,
    });
  }

  onCancelClick = (e) => {
    this.context.router.goBack();
  }

  onDetailFieldChange = (feildName) => {
    const innerFunc = ({ fileList }) => {
      each(fileList, (file) => {
        if (file.status === 'done' && file.response) {
          file.url = `${imageUrlPrefixs}${file.response.key}`;
          message.success(`上传成功: ${file.name}`);
        } else if (file.status === 'error') {
          message.error(`上传失败: ${file.name}`);
        }
      });
      this.props.form.setFieldsValue({ [feildName]: fileList });
    };
    return innerFunc;
  }

  normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  amountProps(nextProps) {
    const { product } = nextProps;
    const { setFieldsInitialValue, getFieldProps, getFieldsValue } = this.props.form;
    const { model } = product;
    if (product.success && !isEmpty(model.headImgs)) {
      getFieldProps('mainPic');
      setFieldsInitialValue({
        mainPic: [{
          uid: model.headImgs,
          url: model.headImgs,
          name: model.headImgs,
          thumbUrl: model.headImgs,
          status: 'done',
        }],
      });
    }
    if (product.success && !isEmpty(model.contentImgs)) {
      const detailPics = [];
      each(model.contentImgs, (img) => {
        detailPics.push({
          uid: img,
          url: img,
          name: img,
          thumbUrl: img,
          status: 'done',
        });
      });
      getFieldProps('detailPics');
      setFieldsInitialValue({ detailPics: detailPics });
    }
    if (product.success && !isEmpty(product.skuExtras)) {
      map(groupBy(product.skuExtras, 'color'), (values, key) => {
        const item = values[0];
        if (isEmpty(item.picPath)) {
          return;
        }
        getFieldProps(key);
        setFieldsInitialValue({
          [key]: [{
            uid: item.picPath,
            url: item.picPath,
            name: item.picPath,
            thumbUrl: item.picPath,
            status: 'done',
          }],
        });
      });
    }
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  })

  render() {
    const { uptoken, product, material } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue } = this.props.form;
    return (
      <Form>
        <Form.Item>
          <Alert
            message={product.memo}
            type="warning"
            />
        </Form.Item>
        <Form.Item
          {...this.formItemLayout()}
          label="商品主图"
          help="主图只能上传一张，如果要替换请先删除。"
          required>
          <Uploader
            {...getFieldProps('mainPic')}
            fileList={getFieldValue('mainPic')}
            onRemove={this.onRemove}
            onChange={this.onDetailFieldChange('mainPic')}
            uptoken={uptoken.token}
            />
        </Form.Item>
        {map(groupBy(product.skuExtras, 'color'), (value, key) => (
          <Form.Item
            {...this.formItemLayout()}
            label={`头图（${key}）`}
            help={`头图（${key}）只能上传一张，如果要替换请先删除。`}
            required>
            <Uploader
              {...getFieldProps(key)}
              fileList={getFieldValue(key)}
              onRemove={this.onRemove}
              onChange={this.onDetailFieldChange(key)}
              uptoken={uptoken.token}
              />
          </Form.Item>
        ))}
        <Form.Item
          {...this.formItemLayout()}
          label="详情"
          help="可一次性选中多张图片上传"
          required >
          <Uploader
            {...getFieldProps('detailPics')}
            fileList={getFieldValue('detailPics')}
            onRemove={this.onRemove}
            onChange={this.onDetailFieldChange('detailPics')}
            uptoken={uptoken.token}
            listType={'picture'}
            showDownloadBtn={1}
            multiple
            />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16, offset: 2 }} style={{ marginTop: 120 }}>
          <Row >
            <Col offset="8" span="2">
              <Button onClick={this.onCancelClick}>返回</Button>
            </Col>
            <Col span="2">
              <Button type="primary" onClick={this.onSaveClick} loading={material.isLoading}>保存</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    );
  }
}

export const PicturesForm = Form.create()(Pictures);
