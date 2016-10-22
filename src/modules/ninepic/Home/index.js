import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import { fetchNinepics, deleteNinepic } from 'redux/modules/ninePic/ninepics';
import { assign, map } from 'lodash';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/ninePic/ninepicFilters';

const actionCreators = {
  fetchFilters: fetchFilters,
  fetchNinepics: fetchNinepics,
  deleteNinepic: deleteNinepic,
};

@connect(
  state => ({
    ninepics: state.ninepics,
    listFilters: state.ninepicFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    listFilters: React.PropTypes.object,
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
    filters: {
      pageSize: 10,
      page: 1,
      ordering: '-start_time',
    },
  }

  componentWillMount() {
    console.log(this.props);
    this.props.fetchFilters();
    this.props.fetchNinepics();
  }

  onCreateNinepicClick = (e) => {
    this.context.router.push('ninepics/edit');
  }

  onDeleteNinepicClick = (e) => {
    const { nincpicid } = e.currentTarget.dataset;
    this.props.deleteNinepic(nincpicid);
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  getFilters = () => (this.state.filters)

  pagination = () => {
    const { ninepics } = this.props;
    const self = this;
    return {
      total: ninepics.count || 0,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        self.setFilters({ pageSize: pageSize, page: current });
        self.props.fetchNinepics(self.getFilters());
      },
      onChange(current) {
        self.setFilters({ page: current });
        self.props.fetchNinepics(self.getFilters());
      },
    };
  }

  formItemLayout = () => ({
    labelCol: { span: 9 },
    wrapperCol: { span: 18 },
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
      dataIndex: 'cateGory',
      key: 'cateGory',
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
      title: '已经推送？',
      dataIndex: 'isPushed',
      key: 'isPushed',
    },
    {
      title: '款式ID',
      dataIndex: 'detailDodelids',
      key: 'detailDodelids',
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

  render() {
    const { prefixCls, ninepics } = this.props;
    const { getFieldProps } = this.props.form;
    console.log(ninepics.items);
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateNinepicClick}>新建每日推送</Button>
        <Table className="margin-top-sm" rowKey={(record) => (record.id)} pagination={this.pagination()} columns={this.columns()} loading={ninepics.isLoading} dataSource={ninepics.items.results} />
      </div>
    );
  }
}

export const Home = Form.create()(List);
