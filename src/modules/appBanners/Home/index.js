import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm, Search, Icon } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchAppBanners } from 'redux/modules/appBanner/appBanner';

const actionCreators = {
  fetchAppBanners,
};

@connect(
  state => ({
    appBanner: state.appBanner,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class AppBanner extends Component {
  static propTypes = {
    appBanner: React.PropTypes.object,
    fetchAppBanners: React.PropTypes.func,
  };
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  componentWillMount() {
    this.props.fetchAppBanners();
  }
  componentWillReceiveProps(nextProps) {

  }

  colums = () => {
    const self = this;
    return [{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <span><Link to={`appbanners/edit?id=${id}`}>{id}</Link></span>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: '目录',
      dataIndex: 'category',
      key: 'category',
      sorter: true,
    },
    {
      title: '图片',
      dataIndex: 'id',
      key: 'pic',
      render: (pic) => (
        <span><Link to={`appbanners/picture?id=${pic}`}>图片详情</Link></span>
      ),
    },
    {
      title: '是否上线',
      dataIndex: 'isActive',
      key: 'isActive',
      sorter: true,
    },
    {
      title: '上线时间',
      dataIndex: 'activeTime',
      key: 'activeTime',
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created',
      key: 'created',
    },
    ];
    }
    tableProps = () => {
    const self = this;
    const count = this.props.appBanner.count;
    const items = this.props.appBanner.items;
    for (const i of items) {
      if (i.isActive === true) {
        i.isActive = 1;
        } else {
        i.isActive = 0;
      }
    }
    const itemsLength = items.length;
    function onChange(pageNumber) {
      const pageNum = { page: pageNumber };
      const params = { page: pageNumber };
      self.props.fetchAppBanners(params);
    }
    return {
      rowKey: (record) => (record.id),
      dataSource: items,
      pagination: {
        total: count || 0,
        showTotal: total => `共 ${total} 条`,
        defaultPageSize: 15,
        onChange: onChange,
      },
      };
      }
      render() {
      const self = this;
      return (
        <div>
          <Button type="primary"><Link to={'/appbanners/picture/build'}>新建海报</Link></Button>
          <Table {...this.tableProps()} columns={this.colums()} />
        </div>
      );
      }
      }
export const Home = Form.create()(AppBanner);
