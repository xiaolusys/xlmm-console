import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { If, Else } from 'jsx-control-statements';
import { replaceAllKeys, toErrorMsg } from 'utils/object';
import moment from 'moment';
import { Alert, Button, Col, Form, Input, Row, Select, Table, message, Checkbox, Tag, Popconfirm, AutoComplete } from 'antd';
import { assign, each, first, groupBy, isNull, isEmpty, includes, map, merge, parseInt, sortBy, union, uniqBy, trim } from 'lodash';
import { fetchSaleProducts, getSaleProducts } from 'redux/modules/products/saleProducts.js';
import { saveSaleProduct, updateSaleProduct, fetchSaleProduct, deleteSaleProduct, setMainSaleProduct } from 'redux/modules/products/saleProduct.js';
import { fetchProduct } from 'redux/modules/products/stockProduct';
import { fetchSuppliers } from 'redux/modules/supplyChain/suppliers.js';

const actionCreators = {
  saveSaleProduct,
  updateSaleProduct,
  fetchSaleProducts,
  fetchSuppliers,
  fetchSaleProduct,
  deleteSaleProduct,
  setMainSaleProduct,
  getSaleProducts,
  fetchProduct,
};

@connect(
  state => ({
    stockProduct: state.stockProduct,
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
    dateSource: React.PropTypes.object,
    nowMainSupplierId: React.PropTypes.string,
    stockProduct: React.PropTypes.object,
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
    getSaleProducts: React.PropTypes.func,
    setMainSaleProduct: React.PropTypes.func,
    fetchProduct: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    edit: false,
    nowMainSpId: '',
    saleProductId: '',
    table: [],
    supplierId: '',
    suppliers: {
      items: [],
      count: 0,
    },
    supplierNames: [],
  }

  componentWillMount() {
    if (this.props.stockProduct.id) {
      this.props.getSaleProducts(this.props.stockProduct.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { saleProduct, suppliers, stockProduct, saleProducts } = nextProps;
    this.props.form.setFieldsInitialValue({
      title: this.props.stockProduct.name,
      productLink: this.props.stockProduct.refLink,
    });
    if (saleProduct.updated || saleProduct.setMainSaleProduct) {
        message.success('保存成功！');
        saleProduct.updated = false;
        saleProduct.setMainSaleProduct = false;
        this.setState({ saleProduct: saleProduct });
        this.props.getSaleProducts(this.props.stockProduct.id);
        return;
    }
    if (saleProduct.deleteSaleProduct) {
        message.success('删除成功，不再从此供应商购入此商品！');
        saleProduct.deleteSaleProduct = false;
        this.setState({ saleProduct: saleProduct });
        this.props.getSaleProducts(this.props.stockProduct.id);
        return;
    }
    if (saleProduct.failure) {
      message.error(`请求错误: ${toErrorMsg(saleProduct.error) || ''}`);
    }
    if (suppliers) {
      const supplierNames = [];
      map(suppliers.items, (v, k) => {
        supplierNames.push(v.supplierName);
      });
      this.setState({ supplierNames: supplierNames });
    }
    if (stockProduct && saleProducts.initial) {
      this.props.getSaleProducts(this.props.stockProduct.id);
    }
  }
  onSelectSupplier = (value) => {
    let supplierId;
    map(this.props.suppliers.items, (v, k) => {
      if (v.supplierName === value) {
        supplierId = v.id;
      }
    });
    this.setState({ supplierId: supplierId });
  }
  onClickSetSaleProduct = (e) => {
    this.props.setMainSaleProduct(this.state.nowMainSpId);
  }

  onClickSetSpId = (e) => {
    this.setState({ nowMainSpId: e.target.dataset.spid });
  }
  onSaveCancel = () => {
    const state = {
      edit: false,
      nowMainSpId: '',
      saleProductId: '',
      table: [],
      supplierId: '',
      supplierNames: [],
    };
    this.setState(state);
  }

  onSaveClick = () => {
    const { getFieldValue } = this.props.form;
    const params = {
      productId: this.props.stockProduct.id,
      supplierSku: getFieldValue('supplierSku'),
      title: getFieldValue('title'),
      productLink: getFieldValue('productLink'),
      memo: getFieldValue('memo'),
      isBatchMgt: getFieldValue('isBatchMgtOn'),
      isExpireMgt: getFieldValue('isExpireMgtOn'),
      isVendorMgt: getFieldValue('isVendorMgtOn'),
      shelfLifeDays: getFieldValue('shelfLifeDays'),
    };
    if (!this.state.saleProductId) {
      params.supplierId = this.state.supplierId;
      this.props.saveSaleProduct(params);
    } else {
      this.props.updateSaleProduct(this.state.saleProductId, params);
    }
  }

  onClickEdit = (e) => {
    const { spid, supplierid, suppliersku, productlink, producttitle, suppliername, memo, isbatchmgt, isexpiremgt, isvendormgt, shelflifedays } = e.target.dataset;
    const kwargs = {
      supplierId: supplierid,
      supplierName: suppliername,
      supplierSku: suppliersku,
      productLink: productlink,
      title: producttitle,
      memo: memo,
      isBatchMgtOn: isbatchmgt === 'true',
      isExpireMgtOn: isexpiremgt === 'true',
      isVendorMgtOn: isvendormgt === 'true',
      shelfLifeDays: shelflifedays,
    };
    this.setState({
      supplierName: suppliername,
      saleProductId: spid,
      edit: true,
    });
    this.props.form.getFieldProps('shelfLifeDays');
    this.props.form.setFieldsValue(kwargs);
  }

  onClickDelete = (e) => {
    const { spid } = e.target.dataset;
    this.props.deleteSaleProduct(spid);
  }

  handleChange = (e) => {
    if (e && trim(e) !== '') {
      this.props.fetchSuppliers({ supplierName: e });
    }
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
      render: (text, record) => {
        if (record.mainSupplier) {
          return (
            <Tag color="red">{record.id}</Tag>
          );
        }
        return (
          <p>{record.id}</p>
        );
      },
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
      render: (text, record) => {
        if (record.mainSupplier) {
          return (
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
                data-memo={record.memo}
                data-isBatchMgt={record.isBatchMgtOn}
                data-isExpireMgt={record.isExpireMgtOn}
                data-isVendorMgt={record.isVendorMgtOn}
                data-shelfLifeDays={record.shelfLifeDays}
                onClick={this.onClickEdit}>
                编辑
              </a>
              <span className="ant-divider"></span>
              <a data-spid={record.id} onClick={this.onClickDelete}>删除</a>
            </span>);
          }
        return (
          <span>
            <Popconfirm placement="left" title={`确认修改(${this.props.stockProduct.name})的主供应商吗？此操作会修改商品的草稿态订货单（已审核的不变）`} onConfirm={this.onClickSetSaleProduct} okText="修改" cancelText="取消">
              <a data-spid={record.id} onClick={this.onClickSetSpId}>设为主供应商</a>
            </Popconfirm>
            <span className="ant-divider"></span>
            <a
              key={record.id}
              data-spid={record.id}
              data-supplierId={record.saleSupplier.id}
              data-supplierName={record.saleSupplier.supplierName}
              data-productTitle={record.title}
              data-supplierName={record.saleSupplier.supplierName}
              data-supplierSku={record.supplierSku}
              data-productLink={record.productLink}
              data-memo={record.memo}
              data-isBatchMgt={record.isBatchMgtOn}
              data-isExpireMgt={record.isExpireMgtOn}
              data-isVendorMgt={record.isVendorMgtOn}
              data-shelfLifeDays={record.shelfLifeDays}
              onClick={this.onClickEdit}>
              编辑
            </a>
            <span className="ant-divider"></span>
            <a data-spid={record.id} onClick={this.onClickDelete}>删除</a>
          </span>
        );
      },
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
    const { stockProduct, saleProducts, suppliers, supplierId } = this.props;
    const { getFieldProps, getFieldValue, getFieldsValue, getFieldDecorator } = this.props.form;
    return (
      <div>
        <div>
          <Form>
            <Form.Item {...this.formItemLayout()} label="供应商" required>
              <If condition={!this.state.edit}>
                <AutoComplete dataSource={this.state.supplierNames} style={{ width: 600, height: 25 }} onChange={this.handleChange} onSelect={this.onSelectSupplier} placeholder="输入供应商名称" />
              </If>
              <If condition={this.state.edit}>
                <p>{this.state.supplierName}</p>
              </If>
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="商品名称">
              <Input type="text" {...getFieldProps('title')} value={getFieldValue('title')} placeholder="输供应商那边的叫法" />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="供应商货号">
              <Input type="text" {...getFieldProps('supplierSku')} value={getFieldValue('supplierSku')} placeholder="输入厂家商品编码" />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="相关URL">
              <Input type="text" {...getFieldProps('productLink')} value={getFieldValue('productLink')} placeholder="输入厂家订货页面" />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="其他">
              <Checkbox {...getFieldProps('isBatchMgtOn')} checked={getFieldValue('isBatchMgtOn')}>启动批次管理</Checkbox>
              <Checkbox {...getFieldProps('isExpireMgtOn')} checked={getFieldValue('isExpireMgtOn')}>启动保质期管理</Checkbox>
              <Checkbox {...getFieldProps('isVendorMgtOn')} checked={getFieldValue('isVendorMgtOn')}>启动多供应商管理</Checkbox>
            </Form.Item>
            <If condition={getFieldValue('isExpireMgtOn')}>
              <Form.Item {...this.formItemLayout()} label="保质期（天数）">
                <Input type="text" {...getFieldProps('shelfLifeDays')} value={getFieldValue('shelfLifeDays')} placeholder="填数字" />
              </Form.Item>
            </If>
          </Form>
          <Row style={{ marginTop: 10 }}>
            <Col offset="8" span="4">
              <a href="/#/supplier/edit">前往供应商新增页</a>
            </Col>
            <Col span="2">
              <Button onClick={this.onSaveCancel}>重设</Button>
            </Col>
            <Col span="2">
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
