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
import { createModelProduct, updateModelProduct, fetchModelProduct, setPictures } from 'redux/modules/products/modelProduct';
const actionCreators = {
  updateProduct,
  updateMaterial,
  fetchModelProduct,
  setPictures,
};

@connect(
  state => ({
    modelProduct: state.modelProduct,
    stockProduct: state.stockProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Pictures extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    stockProduct: React.PropTypes.object,
    modelProduct: React.PropTypes.object,
    material: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    updateProduct: React.PropTypes.func,
    updateMaterial: React.PropTypes.func,
    fetchModelProduct: React.PropTypes.func,
    setPictures: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    respectiveKeys: [],
  }

  componentWillMount() {
    if (this.props.stockProduct && this.props.stockProduct.modelId && this.props.stockProduct.modelId > 0) {
      this.props.fetchModelProduct(this.props.stockProduct.modelId);
    }
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
    const fieldsValue = getFieldsValue();
    const skuPics = [];
    if (isEmpty(getFieldValue('mainPic'))) {
      message.error('请上传主图');
      return;
    }
    if (isEmpty(getFieldValue('detailPics'))) {
      message.error('请上传详情图');
      return;
    }
    const { stockProduct, modelProduct } = this.props;
    let mainPic = '';
    let detailFirstImg = '';
    const detailPics = [];
    const respectiveImgs = [];
    if (getFieldValue('mainPic')[0].response) {
      mainPic = `${imageUrlPrefixs}${getFieldValue('mainPic')[0].response.key}`;
    } else {
      mainPic = getFieldValue('mainPic')[0].url;
    }

    if (getFieldValue('detailFirstImg')) {
      if (getFieldValue('detailFirstImg')[0].response) {
        detailFirstImg = `${imageUrlPrefixs}${getFieldValue('detailFirstImg')[0].response.key}`;
      } else {
        detailFirstImg = getFieldValue('detailFirstImg')[0].url;
      }
    }

    each(getFieldValue('detailPics'), (file) => {
      if (file.response) {
        detailPics.push(`${imageUrlPrefixs}${file.response.key}`);
      } else {
        detailPics.push(file.url);
      }
    });
    map(modelProduct.respectiveImgs, (value, key) => {
      const file = getFieldValue(key) && getFieldValue(key)[0];
      if (file) {
        respectiveImgs.push([key, file.url]);
      } else {
        message.error(`请上传头图（${key}）`);
      }
    });
    const params = {
      headImgs: mainPic,
      contentImgs: detailPics,
      detailFirstImg: detailFirstImg,
      respectiveImgs: respectiveImgs,
    };
    this.props.setPictures(modelProduct.id, params);
  }

  onCancelClick = (e) => {
    this.context.router.goBack();
  }

  onDetailFieldChange = (fieldName) => {
    const innerFunc = ({ fileList }) => {
      each(fileList, (file) => {
        if (file.status === 'done' && file.response) {
          file.url = `${imageUrlPrefixs}${file.response.key}`;
          message.success(`上传成功: ${file.name}`);
        } else if (file.status === 'error') {
          message.error(`上传失败: ${file.name}`);
        }
      });
      this.props.form.setFieldsValue({ [fieldName]: fileList });
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
    const { modelProduct, stockProduct } = nextProps;
    const { setFieldsInitialValue, getFieldProps, getFieldsValue, setFieldsValue } = this.props.form;
    if (modelProduct.success && !isEmpty(modelProduct.headImgs)) {
      getFieldProps('mainPic');
      setFieldsInitialValue({
        mainPic: [{
          uid: modelProduct.headImgs,
          url: modelProduct.headImgs,
          name: modelProduct.headImgs,
          thumbUrl: modelProduct.headImgs,
          status: 'done',
        }],
      });
    }
    if (modelProduct.success && !isEmpty(modelProduct.detailFirstImg)) {
      getFieldProps('detailFirstImg');
      setFieldsInitialValue({
        detailFirstImg: [{
          uid: modelProduct.detailFirstImg,
          url: modelProduct.detailFirstImg,
          name: modelProduct.detailFirstImg,
          thumbUrl: modelProduct.detailFirstImg,
          status: 'done',
        }],
      });
    }
    if (modelProduct.success && !isEmpty(modelProduct.contentImgs)) {
      const detailPics = [];
      each(modelProduct.contentImgs, (img) => {
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
    if (modelProduct.success && !isEmpty(modelProduct.respectiveImgs)) {
      map(modelProduct.respectiveImgs, (value, key) => {
        if (this.state.respectiveKeys.indexOf(key) < 0) {
          getFieldProps(key);
          setFieldsInitialValue({
            [key]: [{
              uid: value,
              url: value,
              name: value,
              thumbUrl: value,
              status: 'done',
            }],
          });
          const keys = this.state.respectiveKeys;
          keys.push(key);
          this.setState({ respectiveKeys: keys });
        }
      });
    }
    if (modelProduct.updated) {
      message.success('保存成功！');
      modelProduct.updated = false;
      this.setState({ modelProduct: modelProduct });
    }
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 20 },
  })

  render() {
    const { uptoken, stockProduct, material, modelProduct } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue } = this.props.form;
    map(modelProduct.respectiveImgs, (value, key) => {
      getFieldProps(key);
    });
    return (
      <Form>
        <Form.Item label="备注提醒：">
          <Alert
            message={stockProduct.memo}
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
        <If condition={modelProduct && !isEmpty(modelProduct.respectiveImgs)}>
          {map(modelProduct.respectiveImgs, (value, key) => (
            <Form.Item
              {...this.formItemLayout()}
              label={`头图（${key}) `}
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
        </If>
        <Form.Item
          {...this.formItemLayout()}
          label="详情首图"
          help="限一张">
          <Uploader
            {...getFieldProps('detailFirstImg')}
            fileList={getFieldValue('detailFirstImg')}
            onRemove={this.onRemove}
            onChange={this.onDetailFieldChange('detailFirstImg')}
            uptoken={uptoken.token}
            />
        </Form.Item>
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
