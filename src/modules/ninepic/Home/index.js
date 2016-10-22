import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/ninePic/ninepics';
import { assign, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    ninepics: state.ninepics,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
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
    /*  filters: {
        pageSize: 10,
        page: 1,
      },*/
  }

  componentWillMount() {
    this.props.fetchNinepics();
  }

  onCreateNinepicClick = (e) => {
    this.context.router.push('ninepics/edit');
  }

  onDeleteNinepicClick = (e) => {
    const { nincpicid } = e.currentTarget.dataset;
    this.props.deleteNinepic(nincpicid);
  }

  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 100,
    }, {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    }, {
      title: '轮数',
      dataIndex: 'turnsNum',
      key: 'turnsNum',
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
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
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateNinepicClick}>新建每日推送</Button>
        <Table className="margin-top-sm" rowKey={(record) => (record.id)} columns={this.columns()} loading={ninepics.isLoading} dataSource={ninepics.items} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
