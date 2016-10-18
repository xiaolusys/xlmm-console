import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table, Checkbox, Input, Popover, Select, Form, Popconfirm } from 'antd';
import { If } from 'jsx-control-statements';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import { fetchSchedule } from 'redux/modules/supplyChain/schedule';
import { fetchProducts, addProduct, updateProduct, updatePosition, updateAssignedWorker, deleteProduct } from 'redux/modules/supplyChain/scheduleProducts';
import { fetchUsers } from 'redux/modules/auth/users';
import { merge, map } from 'lodash';
import stringcase from 'stringcase';

const actionCreators = { fetchSchedule, fetchProducts, addProduct, updateProduct, updatePosition, updateAssignedWorker, deleteProduct, fetchUsers };

@connect(
  state => ({
    scheduleProducts: state.scheduleProducts,
    schedule: state.schedule,
    users: state.users,
    filters: state.supplierFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class ProductsWithForm extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchSchedule: React.PropTypes.func,
    fetchProducts: React.PropTypes.func,
    addProduct: React.PropTypes.func,
    updateProduct: React.PropTypes.func,
    updatePosition: React.PropTypes.func,
    updateAssignedWorker: React.PropTypes.func,
    deleteProduct: React.PropTypes.func,
    fetchUsers: React.PropTypes.func,
    schedule: React.PropTypes.object,
    scheduleProducts: React.PropTypes.object,
    users: React.PropTypes.object,
    filters: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: 'order_weight',
    },
    selectedRowKeys: [],
    modalVisible: false,
    previewModalVisible: false,
    previewLink: '',
    desingerPopoverVisible: false,
    maintainerPopoverVisible: false,
    desinger: 0,
    maintainer: 0,
    distance: 1,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    this.props.fetchSchedule(id);
    this.props.fetchProducts(id, this.getFilters());
    this.props.fetchUsers({
      isStaff: 'True',
      page: 1,
      pageSize: 100,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.scheduleProducts.success) {
      this.setState({
        desinger: 0,
        maintainer: 0,
        selectedRowKeys: [],
      });
    }
  }

  onOkClick = (selected) => {
    const { id } = this.props.location.query;
    this.props.addProduct(id, selected);
    this.toggleModalVisible();
  }

  onPromotionChange = (e) => {
    const { id } = this.props.location.query;
    const { checked, productId } = e.target;
    this.props.updateProduct(id, productId, {
      isPromotion: checked,
    }, this.getFilters());
  }

  onUpdatePositionClick = (e) => {
    const { id } = this.props.location.query;
    const { direction, productid } = e.currentTarget.dataset;
    this.setFilters({ ordering: 'order_weight' });
    this.props.updatePosition(id, productid, {
      direction: direction,
      distance: this.state.distance,
    }, this.getFilters());
    this.setState({ distance: 1 });
  }

  onDeleteClick = (e) => {
    const { id } = this.props.location.query;
    const { productid } = e.currentTarget.dataset;

    this.props.deleteProduct(id, productid, this.getFilters());
  }

  onPreviewClick = (e) => {
    const { productid } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    this.setState({
      previewModalVisible: true,
      previewLink: `${protocol}//${host}/mall/product/details/${productid}?preview=true`,
    });

  }

  onSubmitClick = (e) => {
    const { id } = this.props.location.query;
    const filters = this.props.form.getFieldsValue();
    if (filters.priceRange && !isNaN(Number(filters.priceRange.split(',')[0]))) {
      filters.minPrice = Number(filters.priceRange.split(',')[0]);
    }

    if (filters.priceRange && !isNaN(Number(filters.priceRange.split(',')[1]))) {
      filters.maxPrice = Number(filters.priceRange.split(',')[1]);
    }

    if (!filters.priceRange) {
      filters.minPrice = undefined;
      filters.maxPrice = undefined;
    }

    if (!filters.saleSupplier) {
      filters.saleSupplier = this.supplierIds();
    }

    filters.page = 1;

    delete filters.priceRange;

    this.setFilters(filters);
    this.props.fetchProducts(id, this.getFilters());
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }

  onAssignDesingerClick = (e) => {
    const { id } = this.props.location.query;
    this.toggleDesingerPopoverVisble();
    this.props.updateAssignedWorker(id, {
      photoUser: this.state.desinger,
      managerDetailIds: this.state.selectedRowKeys,
    }, this.getFilters());
  }

  onDesingerChange = (userId) => {
    this.setState({ desinger: userId });
  }

  onAssignMaintainerClick = (e) => {
    const { id } = this.props.location.query;
    this.toggleMaintainerPopoverVisible();
    this.props.updateAssignedWorker(id, {
      referenceUser: this.state.maintainer,
      managerDetailIds: this.state.selectedRowKeys,
    }, this.getFilters());
  }

  onMaintainerChange = (userId) => {
    this.setState({ maintainer: userId });
  }

  onTableChange = (pagination, filters, sorter) => {
    const { id } = this.props.location.query;
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = `${stringcase.snakecase(sorter.column.key)}`;
        break;
      case 'descend':
        ordering = `-${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchProducts(id, this.getFilters());
  }

  getFilters = () => (this.state.filters)

  setFilters = (filters) => {
    this.setState(merge(this.state.filters, filters));
  }

  setDistance = (e) => {
    this.setState(merge(this.state, { distance: Number(e.target.value) }));
  }

  supplierIds = () => {
    const suppliers = this.suppliers();
    return map(suppliers, (supplier) => (supplier.id)).join(',');
  }

  suppliers = () => {
    const { schedule } = this.props;
    return map(schedule.saleSuppliers, (supplier) => ({ id: supplier.id, name: supplier.supplierName }));
  }

  toggleModalVisible = (e) => {
    this.setState(merge(this.state, { modalVisible: !this.state.modalVisible }));
  }

  toggleDesingerPopoverVisble = () => {
    this.setState({ desingerPopoverVisible: !this.state.desingerPopoverVisible });
  }

  toggleMaintainerPopoverVisible = () => {
    this.setState({ maintainerPopoverVisible: !this.state.maintainerPopoverVisible });
  }

  togglePreviewModalVisible = (e) => {
    this.setState({ previewModalVisible: !this.state.previewModalVisible });
  }

  ajustPositionPopover = (productId, direction) => {
    const { schedule } = this.props;
    const directions = {
      minus: {
        icon: 'arrow-up',
        addonBefore: '向上移动',
      },
      plus: {
        icon: 'arrow-down',
        addonBefore: '向下移动',
      },
    };
    const buttonProps = {
      'data-productid': productId,
      'data-direction': direction,
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Input type="number" addonBefore={directions[direction].addonBefore} addonAfter="个位置" defaultValue={1} onChange={this.setDistance} />
        <Button {...buttonProps} onClick={this.onUpdatePositionClick}>确认</Button>
      </div>
    );

    return (
      <Popover trigger="click" content={content} title="调整位置">
        <Button size="small" type="primary" shape="circle" icon={directions[direction].icon} disabled={schedule.lockStatus} />
      </Popover>
    );
  }

  usersPopover = (params) => {
    const { title, visible, disabled, onClick, onOk, onChange } = params;
    const { users } = this.props;
    const buttonProps = {
      className: 'pull-right',
      style: { marginTop: 10 },
      size: 'small',
      type: 'primary',
    };
    const content = (
      <div className="clearfix" style={{ width: 200 }}>
        <Select showSearch style={{ width: 200 }} placeholder="请选择人员" optionFilterProp="children" notFoundContent="无法找到该员工" onChange={onChange}>
          {users.items.map((user) => (<Select.Option value={user.id}>{`${user.lastName}${user.firstName}`}</Select.Option>))}
        </Select>
        <Button {...buttonProps} onClick={onOk}>确认</Button>
      </div>
    );
    return (
      <Popover trigger="click" visible={visible} content={content} placement="bottom" title={title}>
        <Button type="primary" onClick={onClick} disabled={disabled}>{title}</Button>
      </Popover>
    );
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const { scheduleProducts, schedule } = this.props;
    return [{
      title: 'id',
      dataIndex: 'modelId',
      key: 'modelId',
      width: 60,
      render: (modelId, record) => (<a target="_blank" href={`/admin/pay/modelproduct/${record.modelId}/`}>{modelId}</a>),
    }, {
      title: '图片',
      dataIndex: 'productPic',
      key: 'productPic',
      // fixed: 'left',
      render: (productPic, record) => {
        const conetnt = (<img style={{ height: '360px' }} src={productPic} role="presentation" />);
        return (
          <Popover placement="right" content={conetnt} trigger="hover">
            <a target="_blank" href={`/admin/supplier/saleproduct/${record.id}/`} title={record.id}>
              <img style={{ height: '80px' }} src={productPic} role="presentation" />
            </a>
          </Popover>
        );
      },
    }, {
      title: '名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
      render: (productName, record) => (<a target="_blank" href={record.productLink}>{productName}</a>),
    }, {
      title: '吊牌价',
      dataIndex: 'productOriginPrice',
      key: 'productOriginPrice',
      width: 60,
    }, {
      title: '售价',
      dataIndex: 'productSalePrice',
      key: 'productSalePrice',
      width: 60,
    }, {
      title: '采购价',
      dataIndex: 'productPurchasePrice',
      key: 'productPurchasePrice',
      width: 60,
    }, {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierId',
      render: (supplierName) => (supplierName || '-'),
      width: 100,
      sorter: true,
    }, {
      title: '设计',
      dataIndex: 'photoUsername',
      key: 'design',
      render: (username, record) => (
        <div>
          <p><span>负责人: </span>{username || '-'}</p>
          <p><span>进度: </span>{record.designComplete ? '已完成' : '未完成'}</p>
        </div>
      ),
      sorter: true,
    }, {
      title: '资料录入',
      dataIndex: 'referenceUsername',
      key: 'reference',
      render: (username, record) => (
        <div>
          <p><span>负责人: </span>{username || '-'}</p>
          <p><span>进度: </span>{record.materialStatus || '-'}</p>
        </div>
      ),
      sorter: true,
    }, {
      title: '负责人',
      dataIndex: 'productContactor',
      key: 'productContactor',
      render: (username, record) => (username || '-'),
      sorter: true,
    }, {
      title: '备注',
      dataIndex: 'productMemo',
      key: 'productMemo',
      width: 100,
      render: (memo) => (memo || '-'),
    }, {
      title: '每日推送',
      dataIndex: 'id',
      key: 'id',
      render: (productId, record) => {
        const checkboxProps = {
          checked: record.isPromotion,
          onChange: this.onPromotionChange,
          productId: productId,
          disabled: schedule.lockStatus,
        };
        return (
          <Checkbox {...checkboxProps}>推送</Checkbox>
        );
      },
    }, {
      title: '调整位置',
      dataIndex: 'orderWeight',
      key: 'orderWeight',
      render: (orderWeight, record) => (
        <div style={{ width: 60, textAlign: 'center' }}>
          <div className="pull-left">
            {this.ajustPositionPopover(record.id, 'plus')}
          </div>
          <div className="pull-right">
            {this.ajustPositionPopover(record.id, 'minus')}
          </div>
        </div>
      ),
    }, {
      title: '操作',
      dataIndex: 'operating',
      key: 'operating',
      // fixed: 'right',
      render: (text, record) => (
        <div>
          <ul style={{ display: 'block' }}>
            <li >
              <a target="_blank" href={`/apis/items/v1/product?supplier_id=${record.supplierId}&saleproduct=${record.saleProductId}`} disabled={schedule.lockStatus || record.inProduct}>资料录入</a>
            </li>
            <li >
              <a target="_blank" href={`/mm/add_aggregeta/?search_model=${record.modelId}`} disabled={schedule.lockStatus}>上传图片</a>
            </li>
            <li >
              <Popconfirm placement="left" title={`确认删除(${record.productName})吗？`} data-productid={record.id} disabled={schedule.lockStatus} onConfirm={this.onDeleteClick} okText="删除" cancelText="取消">
                <a >删除商品</a>
              </Popconfirm>
            </li>
            <li >
              <a data-productid={record.modelId} onClick={this.onPreviewClick}>预览商品</a>
            </li>
          </ul>
        </div>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { id } = this.props.location.query;
    const { scheduleProducts, schedule } = this.props;
    const { selectedRowKeys } = this.state;
    return {
      pagination: {
        total: scheduleProducts.count || 0,
        showTotal: (total) => (`共 ${total} 条`),
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
          self.props.fetchProducts(id, self.getFilters());
        },
      },
      rowSelection: {
        selectedRowKeys,
        onChange: this.onSelectChange,
      },
      rowKey: (record) => (record.id),
      loading: scheduleProducts.isLoading,
      dataSource: scheduleProducts.items,
      className: 'margin-top-sm',
      onChange: this.onTableChange,
    };
  }

  render() {
    const { id } = this.props.location.query;
    const { prefixCls } = this.props;
    const { schedule, scheduleProducts, filters } = this.props;
    const { selectedRowKeys } = this.state;
    const hasSelected = selectedRowKeys.length > 0;
    const { getFieldProps } = this.props.form;
    const desingerPopover = {
      title: '指定设计',
      disabled: schedule.lockStatus || !hasSelected,
      visible: this.state.desingerPopoverVisible,
      onClick: this.toggleDesingerPopoverVisble,
      onOk: this.onAssignDesingerClick,
      onChange: this.onDesingerChange,
    };
    const maintainerPopover = {
      title: '指定资料录入',
      disabled: schedule.lockStatus || !hasSelected,
      visible: this.state.maintainerPopoverVisible,
      onClick: this.toggleMaintainerPopoverVisible,
      onOk: this.onAssignMaintainerClick,
      onChange: this.onMaintainerChange,
    };
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="类目" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleCategory')} allowClear placeholder="请选择类目" notFoundContent="无可选项">
                  {map(filters.categorys, (category) => (<Select.Option value={category[0]}>{category[1]}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="价格范围" {...this.formItemLayout()} >
                <Select {...getFieldProps('priceRange')} allowClear placeholder="请选择价格区间" notFoundContent="无可选项">
                  {map(constants.priceRanges, (range) => (<Select.Option value={range.value}>{range.lable}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="供应商" {...this.formItemLayout()} >
                <Select {...getFieldProps('saleSupplier')} allowClear placeholder="请选择供应商" notFoundContent="无可选项">
                  {map(this.suppliers(), (supplier) => (<Select.Option value={supplier.id}>{supplier.name}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.toggleModalVisible} disabled={schedule.lockStatus}>添加商品</Button>
            </Col>
            <Col span={2}>
              {this.usersPopover(desingerPopover)}
            </Col>
            <Col span={2}>
              {this.usersPopover(maintainerPopover)}
            </Col>
            <Col span={2} offset={16}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table {...this.tableProps()} columns={this.columns()} />
        <If condition={schedule.success}>
          <Modals.ProductLib visible={this.state.modalVisible} suppliers={this.suppliers()} scheduleId={id} onOk={this.onOkClick} onCancel={this.toggleModalVisible} />
        </If>
        <Modals.Preview visible={this.state.previewModalVisible} url={this.state.previewLink} onCancel={this.togglePreviewModalVisible} title="商品预览" />
      </div>
    );
  }
}


export const Products = Form.create()(ProductsWithForm);
