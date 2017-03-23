import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Checkbox, Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card, Alert } from 'antd';
import Modals from 'modules/Modals';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { Uploader } from 'components/Uploader';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';
import { imageUrlPrefixs } from 'constants';
import { fetchActivityProduct, saveActivityProduct, resetActivityProduct } from 'redux/modules/activity/activityProduct';
import { fetchModelProductHeadImg } from 'redux/modules/products/modelproduct';


const actionCreators = {
  fetchActivityProduct,
  saveActivityProduct,
  resetActivityProduct,
  fetchModelProductHeadImg,
  fetchUptoken,
};

@connect(
  state => ({
    activityProduct: state.activityProduct,
    uptoken: state.uptoken,
    filters: state.activityProductFilters,
    modelProduct: state.modelProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class acpEdit extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchActivityProduct: React.PropTypes.func,
    fetchActivitProductFilters: React.PropTypes.func,
    filters: React.PropTypes.object,
    saveActivityProduct: React.PropTypes.func,
    fetchUptoken: React.PropTypes.func,
    uptoken: React.PropTypes.object,
    resetActivityProduct: React.PropTypes.func,
    fetchModelProductHeadImg: React.PropTypes.func,
    activityProduct: React.PropTypes.object,
    modelProduct: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activityProduct-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {}

  componentWillMount() {
    const { id } = this.props.location.query;
    const { activityId } = this.props.location.query;
    console.log('in will mount ....', activityId);
    if (id) {
      this.props.fetchActivityProduct(id);
    }
    this.props.fetchUptoken();
  }

  componentWillReceiveProps(nextProps) {
    const { activityProduct, filters, modelProduct } = nextProps;
    if (activityProduct && !activityProduct.isLoading && activityProduct.success && activityProduct.updated) {
      this.context.router.goBack();
    }

    if (activityProduct && activityProduct.success && !activityProduct.isLoading && this.props.activityProduct.isLoading) {
      const productImg = [];
      if (activityProduct.productImg) {
        productImg.push({ uid: activityProduct.productImg, url: activityProduct.productImg, status: 'done' });
      }
      this.props.form.setFieldsInitialValue({
        id: activityProduct.id,
        activity: activityProduct.activity,
        getPicTypeDisplay: activityProduct.getPicTypeDisplay,
        jumpUrl: activityProduct.jumpUrl,
        locationId: activityProduct.locationId,
        modelId: activityProduct.modelId,
        picType: activityProduct.picType,
        productId: activityProduct.productId,
        productImg: productImg,
        productName: activityProduct.productName,
      });
    } else {
      this.props.form.setFieldsInitialValue({
        productImg: [],
      });
    }

    if (modelProduct && modelProduct.success && !modelProduct.isLoading && this.props.modelProduct.isLoading) {
      const productImg = [];
      if (modelProduct.headImg) {
        productImg.push({ uid: modelProduct.headImg, url: modelProduct.headImg, status: 'done' });
      }
      this.props.form.setFieldsValue({
        modelId: modelProduct.id,
        productImg: productImg,
        productName: modelProduct.name,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetActivityProduct();
  }

  onProductImgRemove = (file) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ productImg: [] });
  }

  onProductImgChange = ({ fileList }) => {
    const self = this;
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ productImg: fileList });
  }

  onPicTypeSelect = (value) => {
    const self = this;
    console.log('selct type:', value);
    this.props.form.setFieldsValue({ picType: value });
  }

  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    let productImg = '';
    if (params.productImg.length > 0) { productImg = params.productImg[0].url; }
    const { activityId } = this.props.location.query;
    console.log('url --->activityId', activityId);
    this.props.saveActivityProduct(this.props.activityProduct.id, activityId, {
        productImg: productImg,
        modelId: params.modelId,
        jumpUrl: params.jumpUrl,
        productName: params.productName,
        picType: this.props.form.getFieldProps('picType').value,
    });
  }

  changeModelid = (e) => {
    this.props.form.setFieldsValue({
        modelId: Number(e.target.value),
      });
  }

  queryModelid = (e) => {
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const modelid = getFieldValue('modelId');
    if (modelid !== 0) {
      this.props.fetchModelProductHeadImg(modelid);
    }
  }

  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  })

  render() {
    const { prefixCls, activityProduct, form, uptoken, filters } = this.props;
    console.log('activityProduct -->', activityProduct);
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    return (
      <div>
        <Row>
          <Col span={18}>
            <Form horizontal className={`${prefixCls}`}>
              <Form.Item {...this.formItemLayout()} label="款式id">
                <div>
                  <Input {...getFieldProps('modelId')} onChange={this.changeModelid} value={getFieldValue('modelId')} />
                  <Button onClick={this.queryModelid} >查询</Button>
                </div>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="名称">
                <Input {...getFieldProps('productName')} value={getFieldValue('productName')} />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="图片类型">
                <Select
                  {...getFieldProps('picType', { rules: [{ required: true }] })}
                  onSelect={this.onPicTypeSelect}
                  value={getFieldValue('picType')}>
                  <If condition={filters && filters.picType && filters.picType.length > 0}>
                    {filters.picType.map((item) => (<Select.Option value={item.value}>{item.name}</Select.Option>)
                  )}
                  </If>
                </Select>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="图片" help="只能上传一张，如果要替换请先删除。" >
                <Uploader
                  {...getFieldProps('productImg')}
                  fileList={getFieldValue('productImg')}
                  onRemove={this.onProductImgRemove}
                  onChange={this.onProductImgChange}
                  uptoken={uptoken.token}
                  />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="跳转链接">
                <Input {...getFieldProps('jumpUrl')} value={getFieldValue('jumpUrl')} />
              </Form.Item>
              <Row>
                <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

export const ActivityProductEdit = Form.create()(acpEdit);
