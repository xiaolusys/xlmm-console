import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form, Input } from 'antd';
import * as constants from 'constants';
import { fetchNinepics, deleteNinepic } from 'redux/modules/ninePic/ninepics';
import { assign, map } from 'lodash';
import Modals from 'modules/Modals';
import stringcase from 'stringcase';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/ninePic/ninepicFilters';
import { getStateFilters, setStateFilters } from 'redux/modules/supplyChain/stateFilters';

const propsFiltersName = 'ninePicList';
const InputGroup = Input.Group;

const actionCreators = {
  fetchNinepics: fetchNinepics,
  fetchFilters: fetchFilters,
  deleteNinepic: deleteNinepic,
  getStateFilters,
  setStateFilters,
};

@connect(
  state => ({
    ninepics: state.ninepics,
    filters: state.ninepicFilters,
    stateFilters: state.stateFilters,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    location: React.PropTypes.any,
    fetchFilters: React.PropTypes.func,
    form: React.PropTypes.object,
    fetchNinepics: React.PropTypes.func,
    deleteNinepic: React.PropTypes.func,
    ninepics: React.PropTypes.object,
    stateFilters: React.PropTypes.object,
    getStateFilters: React.PropTypes.func,
    setStateFilters: React.PropTypes.func,
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
    previewModalVisible: false,
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
    this.props.fetchFilters();
    this.props.fetchNinepics(filters);
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

  onPreviewClick = (e) => {
    const { id } = e.currentTarget.dataset;
    const { protocol, host } = window.location;
    this.setState({
      previewModalVisible: true,
      previewLink: `${protocol}//${host}/mall/mama/everydaypush?id=${id}`,
    });
  }

  setFilters = function(filters) {
    assign(this.state.filters, filters);
    this.props.setStateFilters(propsFiltersName, this.state.filters);
    return this.setState(this.state.filters);
  }

  getFilters = () => (this.state.filters)

  togglePreviewModalVisible = (e) => {
    this.setState({ previewModalVisible: !this.state.previewModalVisible });
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 6 },
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
      title: '制作人',
      dataIndex: 'auther',
      key: 'auther',
      width: 80,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 150,
    },
    {
      title: '内容',
      dataIndex: 'description',
      key: 'description',
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'picArry',
      key: 'picArry',
      width: 300,
      render: (picArry, record) => (
        <div>
          {map(picArry || [], (pic) => (
            <Popover placement="right" content={<img src={pic} role="presentation"></img>} trigger="hover">
              <img style={{ width: '50px', height: '60px' }} src={pic} role="presentation" />
            </Popover>
            ))
          }
        </div>
      ),
    },
    {
      title: '类别',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 80,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 90,
      render: (startTIime) => (map((startTIime || '').split('T'), (t) => (<p>{t}</p>))),
    }, {
      title: '轮数',
      dataIndex: 'turnsNum',
      key: 'turnsNum',
      width: 50,
    },
    {
      title: '推送',
      dataIndex: 'pushStatus',
      key: 'pushStatus',
      width: 50,
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'modifyID',
      width: 90,
      render: (id, record) => (
        <span>
          <Link to={`ninepics/edit?id=${id}`} >编辑</Link>
          <span className="ant-divider"></span>
          <a data-ninepicid={id} onClick={self.onDeleteNinepicClick}>删除</a>
          <span className="ant-divider"></span>
          <a data-id={id} target="_blank" onClick={self.onPreviewClick}>预览</a>
        </span>
      ),
    }];
  }

  tableProps = () => {
    const self = this;
    const { ninepics } = this.props;
    const { page, pageNum } = this.state.filters;
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
        defaultCurrent: page,
        defaultPageSize: pageNum,
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

  handleInputChange = (e) => {
    this.setFilters({ detailModelids: e.target.value });
  }

  handleSearch = () => {
    this.props.fetchNinepics(this.getFilters());
  }

  render() {
    const { prefixCls, ninepics, placeholder } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal >
          <Form.Item {...this.formItemLayout()} label="查询条件">
            <InputGroup className="filter-modelid">
              <Input placeholder="款式ID" value={this.state.filters.detailModelids} onChange={this.handleInputChange} onFocus={this.handleFocusBlur} onPressEnter={this.handleSearch} />
              <div className="ant-input-group-wrap">
                <Button icon="search" className={777} size={6} onClick={this.handleSearch} />
              </div>
            </InputGroup>
          </Form.Item>
          <Row>
            <Button type="primary" onClick={this.onCreateNinepicClick}>新建每日推送</Button>
          </Row>
        </Form>
        <Table {...this.tableProps()} columns={this.columns()} />
        <Modals.Preview
          visible={this.state.previewModalVisible}
          url={this.state.previewLink}
          onCancel={this.togglePreviewModalVisible}
          title="图片推广预览"
          />
      </div>
    );
  }
}

export const Home = Form.create()(List);
