import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm, Search, Icon } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchAppBanner } from 'redux/modules/appBanner/appBanner';

const actionCreators = {
  fetchAppBanner,
};

@connect(
  state => ({
    appBanner: state.appBanner,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class AppBannerPic extends Component {
  static propTypes = {
    appBanner: React.PropTypes.object,
    fetchAppBanner: React.PropTypes.func,
    location: React.PropTypes.object,
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
    const id = this.props.location.query.id;
    this.props.fetchAppBanner(id);
  }
  componentWillReceiveProps(nextProps) {

  }
  componentWillUnmount() {
  }

  colums = () => {
    const self = this;
    return [
    {
      title: 'picId',
      dataIndex: 'picId',
      key: 'picId',
    },
    {
      title: '图片',
      dataIndex: 'picLink',
      key: 'picLink',
      render: (picLink) => (<span><img src={picLink} role="presentation" /></span>),
    },
    {
      title: '跳转链接',
      dataIndex: 'itemLink',
      key: 'itemLink',
    },
    {
      title: 'APP跳转链接',
      dataIndex: 'appLink',
      key: 'appLink',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id, record, picId) => (
        <span>
          <Link to={`/appbanners/picture/edit?id=${self.props.location.query.id}&picId=${picId}`}>编辑图片</Link>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const count = this.props.appBanner.count;
    const item = this.props.appBanner.item;
    for (let i = 0; i < item.length; i++) {
      item[i].picId = i;
    }
    function onChange(pageNumber) {
      const pageNum = { page: pageNumber };
      const params = { page: pageNumber };
      self.props.fetchAppBanner(params);
    }
    return {
      rowKey: (record) => (record.id),
      dataSource: item,
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
    const id = this.props.location.query.id;
    return (
      <div>
        <Button type="primary"><Link to={`/appbanners/picture/builditem?id=${id}`}>新建海报项</Link></Button>
        <Table {...this.tableProps()} columns={this.colums()} />
      </div>
    );
  }
}

export const AppBannerPicture = Form.create()(AppBannerPic);
