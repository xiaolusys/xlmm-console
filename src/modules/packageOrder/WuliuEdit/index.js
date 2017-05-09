import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Input, Form, Formitem, Row, Select, Table, message, Modal } from 'antd';
import { fetchPackageOrder, updatePackageOrder, resetPackageOrder, changeToPrepare, changeWuliu } from 'redux/modules/packageOrder/packageOrder';
import { fetchPackageOrderFilters } from 'redux/modules/packageOrder/packageOrderFilter';
import { fetchPackageSkuItem } from 'redux/modules/packageSkuItem/packageSkuItem';
import { assign, noop, map, find, isEmpty, each, last } from 'lodash';


const actionCreators = {
  updatePackageOrder,
  fetchPackageOrder,
  resetPackageOrder,
  changeToPrepare,
  fetchPackageOrderFilters,
  fetchPackageSkuItem,
  changeWuliu,
};

@connect(
  state => ({
    packageOrder: state.packageOrder,
    packageOrderFilters: state.packageOrderFilter,
    packageSkuItem: state.packageSkuItem,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class EditWithForm extends Component {
  static propTypes = {
    packageOrder: React.PropTypes.object,
    packageSkuItem: React.PropTypes.object,
    fetchPackageOrder: React.PropTypes.func,
    updatePackageOrder: React.PropTypes.func,
    packageOrderFilters: React.PropTypes.object,
    fetchPackageSkuItem: React.PropTypes.func,
    location: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchPackageOrderFilters: React.PropTypes.func,
    resetPackageOrder: React.PropTypes.func,
    changeToPrepare: React.PropTypes.func,
    changeWuliu: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    wareBy: [],
    logisticsCompany: [],
    packageOrderId: '',
    visibleSelectWareBy: false,
    visibleSelectWuliu: false,
    selectWareBy: '',
    selectLogisticsCompany: '',
    outSid: '',
    logisticsCompanyName: '',
    logisticsCompanyId: '',
    wareById: '',
    wareByName: '',
    sysMemo: '321',
  }

  componentWillMount() {
    const pid = this.props.location.query.pid;
    this.props.fetchPackageOrder(pid);
    this.props.fetchPackageOrderFilters();
    this.props.fetchPackageSkuItem({ package_order_pid: pid });
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    const { item, updated, failure } = nextProps.packageOrder;
    const wareBy = nextProps.packageOrderFilters.wareBy;
    this.setState({ wareBy: wareBy });
    const logisticsCompany = nextProps.packageOrderFilters.logisticsCompany;
    this.setState({ logisticsCompany: logisticsCompany });
    this.setState({ outSid: item.outSid || '-' });
    this.setState({ logisticsCompanyId: item.logisticsCompany });
    this.setState({ logisticsCompanyName: item.logisticsCompanyName });
    this.setState({ wareById: item.wareBy });
    this.setState({ wareByName: item.getWareByDisplay });
    this.setState({ sysMemo: item.sysMemo });

    if (updated) {
      message.success('修改成功');
      this.setState({ visibleSelectWuliu: false });
      this.setState({ visibleSelectWareBy: false });
      // this.context.router.goBack();
    }
    if (failure) {
     message.error(`修改异常: ${nextProps.packageOrder.error}`);
    }
    // console.log(nextProps.packageOrder);
    this.props.form.setFieldsInitialValue({
      oid: item.oid || '-',
      tid: item.tid || '-',
      pid: item.pid || '-',
      id: item.id || '-',
      getPackageTypeDisplay: item.getPackageTypeDisplay || '-',
      getSysStatusDisplay: item.getSysStatusDisplay || '-',
      buyerNick: item.buyerNick || '-',
      receiverName: item.receiverName || '-',
      receiverMobile: item.receiverMobile || '-',
      wareByName: item.getWareByDisplay || '-',
      receiverState: item.receiverState || '-',
      receiverCity: item.receiverCity || '-',
      receiverDistrict: item.receiverDistrict || '-',
      receiverAddress: item.receiverAddress || '-',
      weight: item.weight || '-',
      isQrcode: item.isQrcode || '-',
      qrcodeMsg: item.qrcodeMsg || '-',
      canReview: item.canReview || '-',
      canSendTime: item.canSendTime || '-',
      weightTime: item.weightTime || '-',
      finishTime: item.finishTime || '-',
      logisticsCompany: item.logisticsCompanyName || '-',
      outSid: item.outSid || '-',
      post_cost: item.post_cost || '-',
      isLgtype: item.isLgtype || '-',
      buyerMessage: item.buyerMessage || '-',
      sysMemo: item.sysMemo,
    });
  }

  componentWillUnmount() {
    this.props.resetPackageOrder();
  }
  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const { pid } = this.props.location.query;
    const params = this.props.form.getFieldsValue();
    if (pid) {
      this.props.updatePackageOrder(pid, params);
      return;
    }
  }
  getOutSid = (e) => {
    this.setState({ outSid: e.target.value });
  }
  getSelectWuliu = (value) => {
    this.setState({ logisticsCompanyId: value.key || value });
  }
  getSelectWareBy = (value) => {
    this.setState({ wareById: value.key || value });
  }
  handleChangeWuliu = () => {
    // console.log(this.state.logisticsCompanyId, this.state.outSid);
    const params = { logisticsCompany: this.state.logisticsCompanyId,
      outSid: this.state.outSid };
    const { pid } = this.props.location.query;
    if (pid) {
      this.props.changeWuliu(pid, params);
    }
  }
  handleChangePrepare = () => {
    const { pid } = this.props.location.query;
    this.props.changeToPrepare({ pid: pid });
  }
  handleChangeWareBy = () => {
    // console.log(this.state.wareByName, this.state.wareById);
    const params = { wareBy: this.state.wareById };
    const { pid } = this.props.location.query;
    if (pid) {
      this.props.updatePackageOrder(pid, params);
    }
  }

  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  })

  handleChangeSysMemo = (e) => {
    this.setState({ sysMemo: e.target.value });
  }
  handleSysMemo = () => {
    const { pid } = this.props.location.query;
    if (pid) {
      this.props.updatePackageOrder(pid, { sysMemo: this.state.sysMemo });
    }
  }
  showSelectWareByModal = () => {
    this.setState({ visibleSelectWareBy: true });
  }
  closeSelectWareByModal = () => {
    this.setState({ visibleSelectWareBy: false });
  }
  showSelectWuliuModal = () => {
    this.setState({ visibleSelectWuliu: true });
  }
  closeSelectWuliuModal = () => {
    this.setState({ visibleSelectWuliu: false });
  }
  columns = () => {
    const self = this;
    return [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '原单ID',
      dataIndex: 'oid',
      key: 'oid',
      render: (oid) => { const url = `/admin/pay/saleorder/?oid=${oid}`; return (<a href={url} target="_black">{oid}</a>); },
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      key: 'productId',
      render: (productId) => { const url = `/admin/items/product?id=${productId}`; return (<a href={url} target="_black">{productId}</a>); },
    },
    {
      title: '商品外部编码',
      dataIndex: 'outerId',
      key: 'outerId',
    },
    {
      title: '商品标题',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'SKUID',
      dataIndex: 'skuId',
      key: 'skuId',
      render: (skuId) => { const url = `/admin/items/skustock?sku_id=${skuId}`; return (<a href={url} target="_black">{skuId}</a>); },
    },
    {
      title: 'SKU条码',
      dataIndex: 'outerSkuId',
      key: 'outerSkuId',
      render: (outerSkuId) => { const url = `/admin/items/productsku/${outerSkuId}/`; return (<a href={url} target="_black">{outerSkuId}</a>); },
    },
    {
      title: '规格型号',
      dataIndex: 'skuName',
      key: 'skuName',
    },
    {
      title: '商品数量',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '付款时间',
      dataIndex: 'payTime',
      key: 'payTime',
    },
    {
      title: '备货状态',
      dataIndex: 'getAssignStatusDisplay',
      key: 'getAssignStatusDisplay',
    },
    {
      title: '分配状态',
      dataIndex: 'getStatusDisplay',
      key: 'getStatusDisplay',
    },
    {
      title: '备货时间',
      dataIndex: 'assignTime',
      key: 'assignTime',
    },
    {
      title: '购买时已备货',
      dataIndex: 'initAssigned',
      key: 'initAssigned',
    }];
  }

  tableProps = () => {
    const self = this;
    const count = self.props.packageSkuItem.count;
    const items = self.props.packageSkuItem.items;
    for (const i of items) {
      i.initAssigned === false ? i.initAssigned = '否' : i.initAssigned = '是';
    }
    return {
      dataSource: items,
    };
  }

  render() {
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const wareBy = this.state.wareBy;
    const logisticsCompany = this.state.sysMemo;
    const self = this;
    return (
      <div>
        <Form horizontal>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="包裹单号">
                {getFieldValue('pid')}
                <Input {...getFieldProps('pid', { rules: [{ required: true, message: 'pid必须存在 !' }] })} type="hidden" value={getFieldValue('pid')} placeholder="包裹单号" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="包裹码">
              {getFieldValue('id')}
                <Input {...getFieldProps('id', { rules: [{ required: true, message: 'id必须存在 !' }] })} type="hidden" value={getFieldValue('id')} placeholder="包裹码" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="tid">
                {getFieldValue('tid')}
                <Input {...getFieldProps('tid', { rules: [{ required: true, message: 'tid必须存在 !' }] })} type="hidden" value={getFieldValue('tid')} placeholder="tid" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="包裹类型">
                {getFieldValue('getPackageTypeDisplay')}
                <Input type="hidden" {...getFieldProps('getPackageTypeDisplay', { rules: [{ required: true, message: 'getPackageTypeDisplay必须存在 !' }] })} value={getFieldValue('getPackageTypeDisplay')} placeholder="包裹类型" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="包裹状态">
                {getFieldValue('getSysStatusDisplay')}
                <Input type="hidden" {...getFieldProps('getSysStatusDisplay', { rules: [{ required: true, message: 'getSysStatusDisplay必须存在 !' }] })} value={getFieldValue('getSysStatusDisplay')} placeholder="包裹状态" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="买家昵称">
                {getFieldValue('buyerNick')}
                <Input type="hidden" {...getFieldProps('buyerNick', { rules: [{ required: true, message: 'buyerNick必须存在 !' }] })} value={getFieldValue('buyerNick')} placeholder="买家昵称" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="收货人姓名">
                {getFieldValue('receiverName')}
                <Input type="hidden" {...getFieldProps('receiverName', { rules: [{ required: true, message: '收货人姓名必须存在' }] })} value={getFieldValue('receiverName')} placeholder="收货人姓名" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="收货人手机">
                {getFieldValue('receiverMobile')}
                <Input type="hidden" {...getFieldProps('receiverMobile', { rules: [{ required: true, message: '收货人手机必须存在' }] })} value={getFieldValue('receiverMobile')} placeholder="收货人手机" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="所属仓库">
                {getFieldValue('wareByName')}
                <Input type="hidden" {...getFieldProps('wareByName', { rules: [{ required: true, message: '所属仓库必须存在' }] })} value={getFieldValue('wareByName')} placeholder="所属仓库" />
                &#160;&#160;&#160;&#160;
                <Button type="primary" onClick={this.showSelectWareByModal}>修改仓库</Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="省">
                {getFieldValue('receiverState')}
                <Input type="hidden" {...getFieldProps('receiverState', { rules: [{ required: true, message: '省必须存在' }] })} value={getFieldValue('receiverState')} placeholder="省" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="市">
                {getFieldValue('receiverCity')}
                <Input type="hidden" {...getFieldProps('receiverCity', { rules: [{ required: true, message: '市必须存在' }] })} value={getFieldValue('receiverCity')} placeholder="市" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="区">
                {getFieldValue('receiverDistrict')}
                <Input type="hidden" {...getFieldProps('receiverDistrict', { rules: [{ required: true, message: '区必须存在' }] })} value={getFieldValue('receiverDistrict')} placeholder="区" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="详细地址">
                {getFieldValue('receiverAddress')}
                <Input type="hidden" {...getFieldProps('receiverAddress', { rules: [{ required: true, message: '详细地址必须存在' }] })} value={getFieldValue('receiverAddress')} placeholder="详细地址" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="重量">
                {getFieldValue('weight')}
                <Input type="hidden" {...getFieldProps('weight', { rules: [{ required: true, message: '重量必须存在' }] })} value={getFieldValue('weight')} placeholder="重量" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="热敏订单">
                {getFieldValue('isQrcode')}
                <Input type="hidden" {...getFieldProps('isQrcode', { rules: [{ required: true, message: '热敏订单必须存在' }] })} value={getFieldValue('isQrcode')} placeholder="热敏订单" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="打印信息">
                {getFieldValue('qrcodeMsg')}
                <Input type="hidden" {...getFieldProps('qrcodeMsg', { rules: [{ required: true, message: 'qrcodeMsg必须存在' }] })} value={getFieldValue('qrcodeMsg')} placeholder="打印信息" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="复审">
                {getFieldValue('canReview')}
                <Input type="hidden" {...getFieldProps('canReview', { rules: [{ required: true, message: '复审必须存在' }] })} value={getFieldValue('canReview')} placeholder="复审" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="可发货时间">
                {getFieldValue('canSendTime')}
                <Input type="hidden" {...getFieldProps('canSendTime', { rules: [{ required: true, message: '可发货时间必须存在' }] })} value={getFieldValue('canSendTime')} placeholder="可发货时间" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="称重时间">
            {getFieldValue('weightTime')}
                <Input type="hidden" {...getFieldProps('weightTime', { rules: [{ required: true, message: 'weightTime必须存在' }] })} value={getFieldValue('weightTime')} placeholder="称重时间" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="完成时间">
            {getFieldValue('finishTime')}
                <Input type="hidden" {...getFieldProps('finishTime', { rules: [{ required: true, message: 'finishTime必须存在' }] })} value={getFieldValue('finishTime')} placeholder="完成时间" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="物流成本">
                {getFieldValue('post_cost')}
                <Input type="hidden" {...getFieldProps('post_cost', { rules: [{ required: true, message: 'post_cost必须存在' }] })} value={getFieldValue('post_cost')} placeholder="物流成本" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="速递">
                {getFieldValue('is_lgtype')}
                <Input type="hidden" {...getFieldProps('is_lgtype', { rules: [{ required: true, message: '重量必须存在' }] })} value={getFieldValue('is_lgtype')} placeholder="速递" disabled="true" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="买家留言">
                {getFieldValue('buyerMessage')}
                <Input type="hidden" {...getFieldProps('buyerMessage', { rules: [{ required: true, message: '买家留言必须存在' }] })} value={getFieldValue('buyerMessage')} placeholder="买家留言" disabled="true" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...this.formItemLayout()} label="系统备注" >
                <Input type="hidden" {...getFieldProps('sysMemo', { rules: [] })} value={getFieldValue('sysMemo')} placeholder="系统备注" />
                <Input type="textarea" value={this.state.sysMemo} placeholder="系统备注" onChange={this.handleChangeSysMemo} />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={this.handleSysMemo}>修改备注</Button>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="物流公司">
                {getFieldValue('logisticsCompany')}
                <Input type="hidden" {...getFieldProps('logisticsCompany', { rules: [{ required: true, message: '物流公司必须存在' }] })} value={getFieldValue('logisticsCompany')} placeholder="物流公司" />
                &#160;&#160;&#160;&#160;
                <Button type="primary" onClick={this.showSelectWuliuModal} >修改物流</Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item {...this.formItemLayout()} label="物流编号">
                {getFieldValue('outSid')}
                <Input type="hidden" {...getFieldProps('outSid', { rules: [{ required: true, message: '物流编号必须存在' }] })} value={getFieldValue('outSid')} placeholder="物流编号" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12} ><Button type="primary" onClick={this.handleChangePrepare}>重设准备发货</Button></Col>
          </Row>
          <br />
          <Row>
            <Col span={24} style={{ backgroundColor: '#f5f5f5' }}>
              <label style={{ fontSize: '20px' }}>明细列表</label>
            </Col>
          </Row>
          <Table {...this.tableProps()} columns={this.columns()} />
        </Form>
        <Modal onCancel={this.closeSelectWareByModal} onOk={this.handleChangeWareBy} title="修改仓库" visible={this.state.visibleSelectWareBy}>
          <Select labelInValue defaultValue={{ key: this.state.wareByName, label: this.state.wareByName }} placeholder="请选择仓库" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectWareBy(value)}>
              {map(this.state.wareBy, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
          </Select>
        </Modal>

        <Modal onCancel={this.closeSelectWuliuModal}onOk={this.handleChangeWuliu} title="修改物流" visible={this.state.visibleSelectWuliu}>
          <Row>
            <Col span={4}>物流公司:</Col>
            <Col span={4}>
              <Select labelInValue defaultValue={{ key: this.state.logisticsCompanyId, label: this.state.logisticsCompanyName }} placeholder="请选择物流" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectWuliu(value)}>
              {map(this.state.logisticsCompany, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
              </Select>
            </Col>
          </Row>
          <br />
          <Row>
            <Col span={4}>物流编号: </Col>
            <Col span={6}><Input placeholder="物流编号" defaultValue={this.state.outSid} onChange={this.getOutSid} /></Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export const EditPackageOrder = Form.create()(EditWithForm);
