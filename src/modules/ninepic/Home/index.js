import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import { fetchNinepics, deleteNinepic } from 'redux/modules/ninePic/ninepics';
import { assign, map } from 'lodash';
import stringcase from 'stringcase';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/ninePic/ninepicFilters';

const actionCreators = {
  fetchNinepics: fetchNinepics,
  fetchFilters: fetchFilters,
  deleteNinepic: deleteNinepic,
};

@connect(
  state => ({
    ninepics: state.ninepics,
    filters: state.ninepicFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    form: React.PropTypes.object,
    fetchNinepics: React.PropTypes.func,
    deleteNinepic: React.PropTypes.func,
    ninepics: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'ninepics-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    nincpicid: null,
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-start_time',
    },
  }

  componentWillMount() {
    this.props.fetchFilters();
    this.props.fetchNinepics();
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
    this.props.fetchNinepics(this.getFilters());
  }

  onCreateNinepicClick = (e) => {
    this.context.router.push('ninepics/edit');
  }

  onDeleteNinepicClick = (e) => {
    const { ninepicid } = e.currentTarget.dataset;
    this.props.deleteNinepic(ninepicid);
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
    },
    {
      title: '制作人',
      dataIndex: 'auther',
      key: 'auther',
      width: 100,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '类别',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '轮数',
      dataIndex: 'turnsNum',
      key: 'turnsNum',
    },
    {
      title: '已经推送',
      dataIndex: 'isPushed',
      key: 'isPushed',
    },
    {
      title: '款式ID',
      dataIndex: 'detailModelids',
      key: 'detailModelids',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'modifyID',
      render: (id) => (
        <span>
          <Link to={`ninepics/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <a data-ninepicid={id} onClick={self.onDeleteNinepicClick}>删除</a>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { ninepics } = this.props;

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
        total: ninepics.items.count || 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        onShowSizeChange(current, pageSize) {
          self.setFilters({ pageSize: pageSize, page: current });
          self.props.fetchNinepics(self.getFilters());
        },
        onChange(current) {
          self.setFilters({ page: current });
        },
      },
      loading: ninepics.isLoading,
      dataSource: ninepics.items.results,
      onChange: this.onTableChange,
    };
  }

  render() {
    const { prefixCls, ninepics } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateNinepicClick}>新建每日推送</Button>
        <Table {...this.tableProps()} columns={this.columns()} />
      </div>
    );
  }
}

export const Home = Form.create()(List);
