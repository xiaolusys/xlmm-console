import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Input, Form, FormItem, Row, Select, Table, message } from 'antd';
import { find, isEmpty, each, last } from 'lodash';
import { fetchFilters } from 'redux/modules/supplyChain/supplierFilters';
import { fetchProvinces, fetchCities, fetchDistricts } from 'redux/modules/supplyChain/district';
import { fetchSupplier, saveSupplier, updateSupplier, resetSupplier } from 'redux/modules/supplyChain/supplier';
import { toErrorMsg } from 'utils/object';

const actionCreators = {
  fetchFilters,
  fetchProvinces,
  fetchCities,
  fetchDistricts,
  fetchSupplier,
  saveSupplier,
  updateSupplier,
  resetSupplier,
};

@connect(
  state => ({
    filters: state.supplierFilters,
    district: state.district,
    supplier: state.supplier,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditWithForm extends Component {

  static propTypes = {
    location: React.PropTypes.object,
    params: React.PropTypes.object,
    form: React.PropTypes.object,
    filters: React.PropTypes.object,
    district: React.PropTypes.object,
    fetchFilters: React.PropTypes.func,
    fetchProvinces: React.PropTypes.func,
    fetchCities: React.PropTypes.func,
    fetchDistricts: React.PropTypes.func,
    fetchSupplier: React.PropTypes.func,
    saveSupplier: React.PropTypes.func,
    updateSupplier: React.PropTypes.func,
    resetSupplier: React.PropTypes.func,
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
    const { filters } = this.props;
    const { id } = this.props.location.query;
    if (isEmpty(filters.categorys)) {
      this.props.fetchFilters();
    }
    this.props.fetchProvinces();
    if (id) {
      this.props.fetchSupplier(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { supplier } = nextProps;
    if (!supplier.isLoading && supplier.success) {
      this.props.form.setFieldsInitialValue({
        supplierName: supplier.supplierName,
        supplierCode: supplier.supplierCode,
        mainPage: supplier.mainPage,
        category: supplier.category,
        platform: supplier.platform,
        supplierType: supplier.supplierType,
        progress: supplier.progress,
        province: supplier.province,
        city: supplier.city,
        district: supplier.district,
        stockingMode: supplier.stockingMode,
        wareBy: supplier.wareBy,
        address: supplier.address,
        contact: supplier.contact,
        mobile: supplier.mobile,
        qq: supplier.qq,
        weixin: supplier.weixin,
        speciality: supplier.speciality,
        memo: supplier.memo,
      });
    }
    if (supplier.updated && supplier.success) {
      message.success('保存成功');
      this.context.router.goBack();
    }
    if (supplier.failure) {
      message.error(`保存异常: ${toErrorMsg(supplier.error)}`);
      // this.context.router.goBack();
    }
  }

  componentWillUnmount() {
    this.props.resetSupplier();
  }

  onProvinceChange = (value) => {
    this.props.form.setFieldsValue({ province: value });
    this.props.form.setFieldsValue({ city: undefined });
    this.props.form.setFieldsValue({ district: undefined });
    this.props.fetchCities(value);
  }

  onCityChange = (value) => {
    this.props.form.setFieldsValue({ city: value });
    this.props.form.setFieldsValue({ district: undefined });
    this.props.fetchDistricts(value);
  }

  onDistrictChange = (value) => {
    this.props.form.setFieldsValue({ district: value });
  }

  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });

    const { provinces, cities } = this.props.district;
    const { id } = this.props.location.query;
    const params = this.props.form.getFieldsValue();
    const baseAddr = `${this.getValue(params.province, provinces)}/${this.getValue(params.city, cities)}/${params.district}`;
    params.address = `${baseAddr}/${last(params.address.split('/'))}`;
    delete params.province;
    delete params.city;
    delete params.district;
    if (id) {
      this.props.updateSupplier(id, params);
      return;
    }
    this.props.saveSupplier(params);
  }

  getValue = (id, items) => (find(items, (item) => (item.id === id)).name);

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { filters, district } = this.props;
    return (
      <div>
        <Form horizontal>
          <Form.Item {...this.formItemLayout()} label="公司名称">
            <Input {...getFieldProps('supplierName', { rules: [{ required: true, message: '请输入公司名称！' }] })} value={getFieldValue('supplierName')} placeholder="请输入公司名称" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="品牌名称">
            <Input {...getFieldProps('supplierCode', { rules: [{ required: true, message: '请输入品牌名称！' }] })} value={getFieldValue('supplierCode')} placeholder="请输入品牌名称" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="品牌主页">
            <Input {...getFieldProps('mainPage', { rules: [{ required: true, message: '请输入品牌主页！' }] })} value={getFieldValue('mainPage')} placeholder="请输入品牌主页" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类别">
            <Select {...getFieldProps('category', { rules: [{ required: true, type: 'number', message: '请选择供应商类别！' }] })} value={getFieldValue('category')} placeholder="请选择供应商类别">
              {filters.categorys.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="来源">
            <Select {...getFieldProps('platform', { rules: [{ required: true, message: '请选择供应商所在平台！' }] })} value={getFieldValue('platform')} placeholder="请选择供应商所在平台">
              {filters.platform.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类型">
            <Select {...getFieldProps('supplierType', { rules: [{ required: true, type: 'number', message: '请选择供应商类型！' }] })} value={getFieldValue('supplierType')} placeholder="请选择供应商类型">
              {filters.supplierType.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="进度">
            <Select {...getFieldProps('progress', { rules: [{ required: true, message: '请选择当前进度！' }] })} value={getFieldValue('progress')} placeholder="请选择当前进度">
              {filters.progress.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="区域">
            <Select style={{ width: 108, marginRight: 8 }} {...getFieldProps('province', { rules: [{ required: true, type: 'number', message: '请选择省份！' }] })} value={getFieldValue('province')} placeholder="请选择省份" onChange={this.onProvinceChange}>
              {district.provinces.map((item) => (<Select.Option value={item.id}>{item.name}</Select.Option>))}
            </Select>
            <Select style={{ width: 108, marginRight: 8 }} {...getFieldProps('city', { rules: [{ required: true, type: 'number', message: '请选择城市！' }] })} value={getFieldValue('city')} placeholder="请选择城市" onChange={this.onCityChange}>
              {district.cities.map((item) => (<Select.Option value={item.id}>{item.name}</Select.Option>))}
            </Select>
            <Select style={{ width: 108, marginRight: 8 }} {...getFieldProps('district', { rules: [{ required: true, type: 'number', message: '请选择地区！' }] })} value={getFieldValue('district')} placeholder="请选择地区" onChange={this.onDistrictChange}>
              {district.districts.map((item) => (<Select.Option value={item.name}>{item.name}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="详细地址">
            <Input {...getFieldProps('address', { rules: [{ required: true, message: '请输入地址！' }] })} value={getFieldValue('address')} placeholder="请输入地址" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="仓库">
            <Select {...getFieldProps('wareBy', { rules: [{ required: true, type: 'number', message: '请选择仓库！' }] })} value={getFieldValue('wareBy')} placeholder="请选择仓库">
              {filters.wareBy.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="存货模式">
            <Select {...getFieldProps('stockingMode', { rules: [{ required: true, type: 'number', message: '请选择存货模式！' }] })} value={getFieldValue('stockingMode')} placeholder="请选择存货模式">
              {filters.stockingMode.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="联系人">
            <Input {...getFieldProps('contact', { rules: [{ required: true, message: '请输入联系人！' }] })} value={getFieldValue('contact')} placeholder="请输入联系人" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="联系人手机">
            <Input {...getFieldProps('mobile', { rules: [{ required: true, min: 11, max: 11, message: '请输入11位手机号！' }] })} value={getFieldValue('mobile')} placeholder="请输入联系人手机" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="联系人QQ">
            <Input {...getFieldProps('qq')} value={getFieldValue('qq')} placeholder="请输入联系人QQ" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="联系人微信">
            <Input {...getFieldProps('weixin')} value={getFieldValue('weixin')} placeholder="请输入联系人微信" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="产品特长">
            <Input {...getFieldProps('speciality')} value={getFieldValue('speciality')} placeholder="请输入产品特长" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="备注">
            <Input {...getFieldProps('memo')} value={getFieldValue('memo')} placeholder="备注" />
          </Form.Item>
          <Row>
            <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export const SupplierEdit = Form.create()(EditWithForm);
