import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table, Popover, Badge } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/schedules';
import { assign, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    schedules: state.schedules,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
export class Home extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
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

  onScheduleTypesMenuClick = (e) => {
    this.setFilters({ scheduleType: e.key });
    this.props.fetchSchedules(this.getFilters());
  }

  onRangeChange = (date) => {
    this.setFilters({
      saleTimeStart: moment(date[0]).format('YYYY-MM-DD'),
      saleTimeEnd: moment(date[1]).format('YYYY-MM-DD'),
    });
    this.props.fetchSchedules(this.getFilters());
  }

  onCreateScheduleClick = (e) => {
    this.context.router.push('schedule/edit');
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  columns = () => {
    const self = this;
    return [{
      title: '日期',
      dataIndex: 'saleTime',
      key: 'date',
    }, {
      title: '类型',
      dataIndex: 'scheduleTypeLable',
      key: 'scheduleTypeLable',
    }, {
      title: '商品',
      dataIndex: 'productNum',
      key: 'productNum',

    }, {
      title: '供应商',
      dataIndex: 'saleSuppliers',
      key: 'saleSuppliers',
      render: (suppliers) => (
        <Popover content={self.popoverContent(suppliers)} title="供应商" trigger="hover">
          <a>{suppliers.length}</a>
        </Popover>
      ),
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
        </span>
      ),
    }];
  }

  popoverContent = (suppliers) => (
    suppliers.length > 0 ? map(suppliers, (supplier) => (<p>{supplier.supplierName}</p>)) : '暂无供应商'
  )

  dropdownTitle = () => {
    const { filters } = this.state;
    return filters.scheduleType ? constants.scheduleTypes[filters.scheduleType].lable : '排期类型';
  }

  scheduleTypesMenu = () =>
    (<Menu onClick={this.onScheduleTypesMenuClick}>
      {map(constants.scheduleTypes, (type) =>
        (<Menu.Item key={type.id}>{type.lable}</Menu.Item>)
      )}
    </Menu>)

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
    const { prefixCls } = this.props;
    const { schedules } = this.props;
    return (
      <div className={`${prefixCls}`} >
        <Row gutter={2} type="flex" align="middle" justify="start">
          <Col span={2}>
            <Button type="primary" onClick={this.onCreateScheduleClick}>新建排期</Button>
          </Col>
          <Col span={3} >
            <Dropdown.Button overlay={this.scheduleTypesMenu()} type="ghost">{this.dropdownTitle()}</Dropdown.Button>
          </Col>
          <Col span={3} >
            <DatePicker.RangePicker onChange={this.onRangeChange} />
          </Col>
        </Row>
        <Table className="margin-top-sm" columns={this.columns()} pagination={this.pagination()} loading={schedules.isLoading} dataSource={schedules.items} />
      </div>
    );
  }
}
