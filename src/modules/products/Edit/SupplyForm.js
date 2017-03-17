import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { If } from 'jsx-control-statements';
import { replaceAllKeys, toErrorMsg } from 'utils/object';
import moment from 'moment';
import { Alert, Button, Col, Form, Input, Row, Select, Table, message } from 'antd';
import { assign, each, first, groupBy, isNull, isEmpty, includes, map, merge, parseInt, sortBy, union, uniqBy } from 'lodash';
import { fetchSaleProducts } from 'redux/modules/products/saleProducts.js';
import { saveSaleProduct, updateSaleProduct, fetchSaleProduct, deleteSaleProduct } from 'redux/modules/products/saleProduct.js';
import { fetchSuppliers } from 'redux/modules/supplyChain/suppliers.js';

const actionCreators = {
  saveSaleProduct,
  updateSaleProduct,
  fetchSaleProducts,
  fetchSuppliers,
  fetchSaleProduct,
  deleteSaleProduct,
};

@connect(
  state => ({
    saleProducts: state.saleProducts,
    saleProduct: state.saleProduct,
    suppliers: state.suppliers,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Supply extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    saleProductId: React.PropTypes.object,
    product: React.PropTypes.object,
    saleProduct: React.PropTypes.object,
    suppliers: React.PropTypes.object,
    saleProducts: React.PropTypes.object,
    supplierId: React.PropTypes.object,
    saveSaleProduct: React.PropTypes.func,
    fetchSaleProducts: React.PropTypes.func,
    updateSaleProduct: React.PropTypes.func,
    fetchSuppliers: React.PropTypes.func,
    fetchSaleProduct: React.PropTypes.func,
    deleteSaleProduct: React.PropTypes.func,
    searchKey: React.PropTypes,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    saleProductId: '',
    table: [],
    searchKey: '',
    supplierId: '',
    suppliers: {
      items: [],
      count: 0,
    },
  }

  componentWillMount() {
    this.props.fetchSaleProducts({ productId: this.props.product.id });
  }

  componentWillReceiveProps(nextProps) {
    const { saleProduct } = nextProps;
    if (saleProduct.updated) {
        message.success('保存成功！');
        saleProduct.updated = false;
        this.setState({ saleProduct: saleProduct });
        this.props.fetchSaleProducts({ productId: this.props.product.id });
        return;
    }
    if (saleProduct.failure) {
      message.error(`请求错误: ${toErrorMsg(saleProduct.error) || ''}`);
    }
  }

  onInput = (e) => {
    const { value } = e.target;
    this.setState({ searchKey: value });
  }

  onChangeSupplier = (value) => {
    this.setState({ supplierId: value });
  }

  onSaveCancel = () => {
    message.success('待做功能');
  }

  onSaveClick = () => {
    const { getFieldValue } = this.props.form;
    const params = {
      productId: this.props.product.id,
      supplierSku: getFieldValue('supplierSku'),
      title: getFieldValue('title'),
      productLink: getFieldValue('productLink'),
      memo: getFieldValue('memo'),
    };
    if (!this.state.saleProductId) {
      params.supplierId = this.state.supplierId;
      this.props.saveSaleProduct(params);
    } else {
      this.props.updateSaleProduct(this.state.saleProductId, params);
    }
  }

  onClickEdit = (e) => {
    const { spid, supplierid, suppliersku, productlink, producttitle, suppliername } = e.target.dataset;
    const kwargs = {
      supplierId: suppliername,
      supplierSku: suppliersku,
      productLink: productlink,
      title: producttitle,
    };
    this.setState({
      saleProductId: spid,
    });
    this.props.form.setFieldsValue(kwargs);
  }

  onClickDelete = (e) => {
    const { spid } = e.target.dataset;
    this.props.deleteSaleProduct(spid);
  }

  search = () => {
    this.props.fetchSuppliers({ supplierName: this.state.searchKey });
  }


  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  })

  columns = () => ([{
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      width: 80,
      render: (text, record) => (<p>{record.id}</p>),
    }, {
      title: '商品名称',
      key: 'productTitle',
      dataIndex: 'productTitle',
      width: 300,
      render: (text, record) => (<p>{record.title}</p>),
    }, {
      title: '供应商名称',
      key: 'supplierName',
      dataIndex: 'supplierName',
      width: 300,
      render: (text, record) => (<p>{record.saleSupplier.supplierName}</p>),
    }, {
      title: '货号',
      key: 'supplierSku',
      dataIndex: 'supplierSku',
      width: 150,
      render: (text, record) => (<p>{record.supplierSku}</p>),
    }, {
      title: '购买链接',
      key: 'productLink',
      dataIndex: 'productLink',
      width: 400,
      render: (text, record) => (<p>{record.productLink}</p>),
    }, {
      title: '录入日期',
      key: 'created',
      dataIndex: 'created',
      width: 150,
      render: (date) => (moment(date).format('YYYY-MM-DD')),
      sorter: true,
    }, {
      title: '操作',
      key: 'operation',
      dataIndex: 'id',
      width: 200,
      render: (text, record) => (
        <span>
          <a
            key={record.id}
            data-spid={record.id}
            data-supplierId={record.saleSupplier.id}
            data-supplierName={record.saleSupplier.supplierName}
            data-productTitle={record.title}
            data-supplierName={record.saleSupplier.supplierName}
            data-supplierSku={record.supplierSku}
            data-productLink={record.productLink}
            onClick={this.onClickEdit}>
            编辑
          </a>
          <span className="ant-divider"></span>
          <a data-spid={record.id} onClick={this.onClickDelete}>删除</a>
        </span>
      ),
    }])

  tableProps = () => {
    const self = this;
    const { saleProducts } = this.props;
    return {
      rowKey: (record) => (record.id),
      pagination: false,
      className: 'margin-top-sm',
      dataSource: saleProducts.items,
      loading: saleProducts.isLoading,
    };
  }


  render() {
    const { product, saleProducts, suppliers, supplierId } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue, getFieldDecorator } = this.props.form;
    return (
      <div>
        <div>
          <Row style={{ marginTop: 10 }}>
            <Col offset="2" span="6">
              <Input type="text" value={getFieldValue('searchKey')} placeholder="请输入供货商名称" {...getFieldProps('searchKey')} onInput={this.onInput} />
            </Col>
            <Col span="2">
              <Button onClick={this.search}>查找</Button>
            </Col>
            <Col span="2">
              <a href="/#/supplier/edit">前往供应商新增页</a>
            </Col>
          </Row>
        </div>
        <div>
          <Form>
            <Form.Item {...this.formItemLayout()} label="供应商" required>
              <Select {...getFieldProps('suppliers')} {...getFieldProps('supplierId')} value={getFieldValue('supplierId')} onSelect={this.onChangeSupplier}>
                 {map(suppliers.items, (supplier) => (<Select.Option value={supplier.id}>{supplier.supplierName}</Select.Option>))}
              </Select>
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="商品名称">
              <Input type="text" {...getFieldProps('title')} value={getFieldValue('title')} placeholder="输供应商那边的叫法" />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="供应商货号">
              <Input type="text" {...getFieldProps('supplierSku')} value={getFieldValue('supplierSku')} placeholder="输入厂家SKU编码" />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="相关URL">
              <Input type="text" {...getFieldProps('productLink')} value={getFieldValue('productLink')} placeholder="输入厂家订货页面" />
            </Form.Item>
          </Form>
          <Row style={{ marginTop: 10 }}>
            <Col offset="4" span="2">
              <Button onClick={this.onSaveCancel}>重设</Button>
            </Col>
            <Col offset="4" span="2">
              <Button onClick={this.onSaveClick}>确认</Button>
            </Col>
          </Row>
          <Row>
            <Col offset="1" span="16">
              <Table {...this.tableProps()} columns={this.columns()} />
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}


export const SupplyForm = Form.create()(Supply);
