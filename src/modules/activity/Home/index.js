import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Input, Select, Menu, Button, DatePicker, Table, Popover, Form, message } from 'antd';
import * as constants from 'constants';
import { fetchActivities } from 'redux/modules/activity/activities';
import { saveActivity, correlateSchedule } from 'redux/modules/activity/activity';
import { fetchFilters } from 'redux/modules/activity/activityFilters';
import { getStateFilters, setStateFilters } from 'redux/modules/supplyChain/stateFilters';
import { assign, isNaN, isEmpty, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';

const propsFiltersName = 'activityList';

const actionCreators = {
  fetchActivities,
  fetchFilters,
  saveActivity,
  correlateSchedule,
  getStateFilters,
  setStateFilters,
};

@connect(
  state => ({
    activities: state.activities,
    filters: state.activityFilters,
    stateFilters: state.stateFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    location: React.PropTypes.any,
    prefixCls: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchActivities: React.PropTypes.func,
    fetchFilters: React.PropTypes.func,
    saveActivity: React.PropTypes.func,
    correlateSchedule: React.PropTypes.func,
    activities: React.PropTypes.object,
    filters: React.PropTypes.object,
    stateFilters: React.PropTypes.object,
    getStateFilters: React.PropTypes.func,
    setStateFilters: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'activities-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-start_time',
    },
  }

  componentWillMount() {
    this.props.getStateFilters();
    const { stateFilters } = this.props;
    const filters = stateFilters[propsFiltersName];
    this.setFilters(filters);
    this.props.fetchActivities(filters);
    this.props.fetchFilters();
  }

  componentWillReceiveProps(nextProps) {
    const { activities } = nextProps;
    if (activities.failure) {
      message.error(`请求错误: ${activities.error.detail || ''}`);
    }
  }

  onCreateActivityClick = (e) => {
    this.context.router.push('activity/edit');
  }

  onSearchClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    filters.page = 1;
    this.setFilters(filters);
    this.props.fetchActivities(this.getFilters());
  }

  onTableChange = (pagination, filters, sorter) => {
    let ordering = this.state.filters.ordering;
    switch (sorter.order) {
      case 'ascend':
        ordering = `${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      case 'descend':
        ordering = `-${sorter.column.dataIndex}__${stringcase.snakecase(sorter.column.key)}`;
        break;
      default:
        ordering = undefined;
        break;
    }
    this.setFilters({ ordering: ordering });
    this.props.fetchActivities(this.getFilters());
  }

  onIsActiveSelect = (value) => {
    const self = this;
    this.setFilters({ isActive: value });
    this.props.fetchActivities(this.getFilters());
  }
  onCorrelateActivitySchedule = () => {
    if (this.state.acids) {
      this.state.acids.map((acid) => (this.props.correlateSchedule(acid)));
    }
  }
  setSelectedAcId = (selected) => {
    const acIds = [];
    selected.map((item) => (acIds.push(item.id)));
    this.state.acids = acIds;
  }

  getFilters = () => {
    const filters = this.state.filters;
    return {
      pageSize: filters.pageSize,
      page: filters.page,
      ordering: filters.ordering,
      isActive: filters.isActive ? filters.isActive.key : '',
      actType: filters.actType ? filters.actType.key : '',
    };
  }

  setFilters = function(filters) {
    assign(this.state.filters, filters);
    this.props.setStateFilters(propsFiltersName, this.state.filters);
    return this.setState(this.state.filters);
  }

  getFilterSelectValue = (field) => {
    const fieldValue = this.props.form.getFieldValue(field);
    return fieldValue ? { value: fieldValue } : {};
  }

  setOrderValId = (e) => {
    const { activityid } = e.currentTarget.dataset;
    const { value } = e.target;
    const { activities } = this.props;
    if (isNaN(value)) {
      message.error('请输入正确的数字');
      return;
    }
    const activityidInt = parseInt(activityid, 10);
    if (activities && activities.items) {
      map(activities.items.results, (item) => {
        if (item && item.id === activityidInt) {
          this.props.saveActivity(activityid, {
            orderVal: value,
            title: item.title,
            actDesc: item.actDesc,
            actImg: item.actImg,
            maskLink: item.maskLink,
            actLogo: item.actLogo,
            shareIcon: item.shareIcon,
            actLink: item.actLink,
            scheduleId: item.scheduleId,
            actType: item.actType,
            startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
            loginRequired: item.loginRequired,
            isActive: item.isActive,
          });
        }
      });
    }
  }

  columns = () => {
    const self = this;
    return [{
      title: '活动ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTIime',
    }, {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    }, {
      title: '排序值',
      dataIndex: 'orderVal',
      key: 'orderVal',
      render: (orderVal, record) => (
        <Input
          style={{ width: 60 }}
          data-activityid={record.id}
          defaultValue={orderVal}
          onChange={this.setOrderValId}
          />
        ),
    }, {
      title: '上线',
      dataIndex: 'isActiveDisplay',
      key: 'isActiveDisplay',
    }, {
      title: '备注',
      dataIndex: 'memoDisplay',
      key: 'memoDisplay',
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`activity/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <Link to={`activity/products?id=${id}`}>活动商品</Link>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { activities } = this.props;
    const { page, pageNum } = this.state.filters;
    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          const selected = map(selectedRows, (row) => ({ id: row.id, name: row.title }));
          self.setSelectedAcId(selected);
        },
      },
      pagination: {
        total: activities.items.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        defaultCurrent: page,
        defaultPageSize: pageNum,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchActivities(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
        },
      },
      loading: activities.isLoading,
      dataSource: activities.items.results,
      onChange: this.onTableChange,
    };
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  render() {
    const { prefixCls, activities, filters } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={6}>
              <Form.Item label="上线类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('isActive')} {...this.getFilterSelectValue('isActive')} labelInValue allowClear placeholder="请选择上线" notFoundContent="无可选项">
                  {map(filters.isActive, (item) => (<Select.Option value={item.value}>{item.name}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
            <Col sm={6}>
              <Form.Item label="活动类型" {...this.formItemLayout()} >
                <Select {...getFieldProps('actType')} {...this.getFilterSelectValue('actType')} labelInValue allowClear placeholder="请选择活动类型" notFoundContent="无可选项">
                  {map(filters.actType, (item) => (<Select.Option value={item.value}>{item.name}</Select.Option>))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col span={2}>
              <Button type="primary" onClick={this.onCreateActivityClick}>新建活动</Button>
            </Col>
            <Col span={2} offset={1}>
              <Button type="primary" onClick={this.onCorrelateActivitySchedule}>同步排期</Button>
            </Col>
            <Col span={2} offset={1}>
              <Button type="primary" onClick={this.onSearchClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" columns={this.columns()} loading={activities.isLoading} {...this.tableProps()} dataSource={activities.items.results} />
      </div>
    );
  }
}

export const Home = Form.create()(List);
