import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/schedules';
import { assign, isEmpty, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    schedules: state.schedules,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchSchedules: React.PropTypes.func,
    schedules: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-sale_time',
    },
  }

  componentWillMount() {
    this.props.fetchSchedules(this.getFilters());
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    if (filters.dateRange) {
      filters.saleTimeStart = moment(filters.dateRange[0]).format('YYYY-MM-DD');
      filters.saleTimeEnd = moment(filters.dateRange[1]).format('YYYY-MM-DD');
      delete filters.dateRange;
    }
    this.setFilters(filters);
    this.props.fetchSchedules(this.getFilters());
  }

  onCreateScheduleClick = (e) => {
    this.context.router.push('schedule/edit');
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [{
      title: '日期',
      dataIndex: 'upshelfTime',
      key: 'datetime',
      render: (upshelfTime) => (map(upshelfTime.split('T'), (t) => (<p>{t}</p>))),
    }, {
      title: '类型',
      dataIndex: 'scheduleTypeLable',
      key: 'scheduleTypeLable',
    }, {
      title: '商品',
      dataIndex: 'productNum',
      key: 'productNum',
      render: (productNum, record) => (
        <Popover content={self.categoryPopoverContent(record.figures.categoryProductNums)} title="类目&商品" trigger="hover">
          <a>{productNum}</a>
        </Popover>
      ),
    }, {
      title: '供应商',
      dataIndex: 'saleSuppliers',
      key: 'saleSuppliers',
      render: (suppliers, record) => (
        <Popover content={self.supplierPopoverContent(record.figures.supplierProductNums)} title="供应商&商品" trigger="hover">
          <a>{suppliers.length}</a>
        </Popover>
      ),
    }, {
      title: '价格&商品',
      dataIndex: 'figures',
      key: 'priceRangeProduct',
      render: (figures) => (map(figures.priceZoneNum, (price) => (<p>{`${price.priceZone}元: 共${price.productNum}件`}</p>))),
    }, {
      title: '负责人',
      dataIndex: 'responsiblePersonName',
      key: 'responsiblePersonName',
    }, {
      title: '锁定',
      dataIndex: 'lockStatus',
      key: 'lockStatus',
      render: (lockStatus) => (
        <span>
          <Icon className={lockStatus ? 'icon-success' : 'icon-error'} type={lockStatus ? 'lock' : 'unlock'} />
          <span> {lockStatus ? '已锁定' : '未锁定'}</span>
        </span>
      ),
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`schedule/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <Link to={`schedule/products?id=${id}`}>商品</Link>
          <span className="ant-divider"></span>
          <a target="_blank" href={`/supplychain/supplier/schedule_detail/?schedule_id=${id}`}>核对库存</a>
        </span>
      ),
    }];
  }

  supplierPopoverContent = (suppliers) => (
    isEmpty(suppliers) ? '暂无供应商' : map(suppliers, (supplier) => (<p>{`${supplier.supplierName}: 共${supplier.productNum}件商品`}</p>))
  )

  categoryPopoverContent = (categories) => (
    isEmpty(categories) ? '暂无' : map(categories, (category) => (<p>{`${category.categoryName}: 共${category.productNum}件商品`}</p>))
  )

  pagination = () => {
    const { schedules } = this.props;
    const self = this;
    return {
      total: schedules.count || 0,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        self.setFilters({ pageSize: pageSize, page: current });
        self.props.fetchSchedules(self.getFilters());
      },
      onChange(current) {
        self.setFilters({ page: current });
        self.props.fetchSchedules(self.getFilters());
      },
    };
  }

  render() {
    const { prefixCls, schedules } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="排期类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('scheduleType')} allowClear placeholder="请选择排期类型" notFoundContent="无可选项">
                  {map(constants.scheduleTypes, (type) => (<Select.Option value={type.id}>{type.lable}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="日期" {...this.formItemLayout()} >
                <DatePicker.RangePicker {...getFieldProps('dateRange')} />
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateScheduleClick}>新建排期</Button>
            </Col>
            <Col span={2} offset={20}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" columns={this.columns()} pagination={this.pagination()} loading={schedules.isLoading} dataSource={schedules.items} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
