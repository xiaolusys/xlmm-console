import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form, Input } from 'antd';
import * as constants from 'constants';
import { fetchAppPushMsgs, deleteAppPushMsg } from 'redux/modules/appPushMsg/apppushmsgs';
import { assign, map } from 'lodash';
import stringcase from 'stringcase';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/appPushMsg/apppushmsgFilters';

const actionCreators = {
  fetchAppPushMsgs: fetchAppPushMsgs,
  deleteAppPushMsg: deleteAppPushMsg,
  fetchFilters: fetchFilters,
};

@connect(
  state => ({
    apppushmsgs: state.apppushmsgs,
    filters: state.apppushmsgFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    form: React.PropTypes.object,
    fetchAppPushMsgs: React.PropTypes.func,
    deleteAppPushMsg: React.PropTypes.func,
    apppushmsgs: React.PropTypes.object,
    filters: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'apppushmsgs-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-push_time',
    },
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.fetchAppPushMsgs();
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
    this.props.fetchAppPushMsgs(this.getFilters());
  }

  onCreateClick = (e) => {
    this.context.router.push('apppushmsgs/edit');
  }

  onDeleteClick = (e) => {
    const { apppushmsgid } = e.currentTarget.dataset;
    this.props.deleteAppPushMsg(apppushmsgid);
  }

  setFilters = function(filters) {
    return this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
    },
    {
      title: '推送内容',
      dataIndex: 'desc',
      key: 'desc',
      width: 300,
    },

    {
      title: 'Target',
      dataIndex: 'targetDisplay',
      key: 'targetDisplay',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'statusDisplay',
      key: 'statusDisplay',
      width: 100,
    },
    {
      title: 'PushTime',
      dataIndex: 'pushTime',
      key: 'pushTime',
      width: 200,
    },

    {
      title: '操作',
      dataIndex: 'id',
      key: 'modifyID',
      render: (id) => (
        <span>
          <Link to={`apppushmsgs/edit?id=${id}`} >编辑</Link>
          <span className="ant-divider"></span>
          <a data-apppushmsgid={id} onClick={self.onDeleteClick}>删除</a>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { apppushmsgs } = this.props;

    return {
      className: 'margin-top-sm',
      rowKey: (record) => (record.id),
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          const selected = map(selectedRows, (row) => ({ id: row.id, name: row.title }));
          self.setSelected(selected);
        },
      },
      pagination: {
        total: apppushmsgs.items.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchAppPushMsgs(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
        },
      },
      loading: apppushmsgs.isLoading,
      dataSource: apppushmsgs.items.results,
      onChange: this.onTableChange,
    };
  }

  render() {
    const { prefixCls, apppushmsgs, placeholder, filters } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateClick}>新建App消息推送</Button>
        <Table {...this.tableProps()} columns={this.columns()} />
      </div>
    );
  }
}

export const Home = Form.create()(List);
