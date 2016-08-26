import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/categories';
import { assign, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    categories: state.categories,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchCategories: React.PropTypes.func,
    categories: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'categories-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      pageSize: 10,
      page: 1,
    },
  }

  componentWillMount() {
    this.props.fetchCategories(this.getFilters());
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    if (filters.dateRange) {
      filters.createdStart = moment(filters.dateRange[0]).format('YYYY-MM-DD');
      filters.createdEnd = moment(filters.dateRange[1]).format('YYYY-MM-DD');
      delete filters.dateRange;
    }
    this.setFilters(filters);
    this.props.fetchCategories(this.getFilters());
  }

  onCreateCategoryClick = (e) => {
    this.context.router.push('categories/edit');
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
      title: '图片',
      key: 'catPic',
      dataIndex: 'catPic',
      width: 100,
      render: (catPic, record) => {
        const conetnt = (<img style={{ height: '360px' }} src={catPic} role="presentation" />);
        return (
          <Popover placement="right" content={conetnt} trigger="hover">
            <img style={{ height: '80px' }} src={catPic} role="presentation" />
          </Popover>
        );
      },
    }, {
      title: '类目ID',
      dataIndex: 'cid',
      key: 'cid',
      render: (cid) => (
        <div style={{ marginLeft: '100px' }} >{cid}</div>
      ),
    }, {
      title: '父类目ID',
      dataIndex: 'parentCid',
      key: 'parentCid',

    }, {
      title: '商品',
      dataIndex: 'fullName',
      key: 'fullName',
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span> {status === 'normal' ? '正常' : '未使用'}</span>
      ),
    }, {
      title: '创建日期',
      dataIndex: 'created',
      key: 'date',
      render: (date) => (moment(date).format('YYYY-MM-DD hh:mm:ss')),
    }, {
      title: '操作',
      dataIndex: 'id',
      key: 'operation',
      render: (id) => (
        <span>
          <Link to={`categories/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <a data-supplierid={id} onClick={self.onDeleteClick}>删除</a>
        </span>
      ),
    }];
  }

  popoverContent = (suppliers) => (
    suppliers.length > 0 ? map(suppliers, (supplier) => (<p>{supplier.supplierName}</p>)) : '暂无供应商'
  )

  pagination = () => {
    const { categories } = this.props;
    const self = this;
    return {
      total: categories.count || 0,
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      onShowSizeChange(current, pageSize) {
        self.setFilters({ pageSize: pageSize, page: current });
        self.props.fetchCategories(self.getFilters());
      },
      onChange(current) {
        self.setFilters({ page: current });
        self.props.fetchCategories(self.getFilters());
      },
    };
  }

  render() {
    const { prefixCls, categories } = this.props;
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
              <Button type="primary" onClick={this.onCreateCategoryClick}>新建类目</Button>
            </Col>
            <Col span={2} offset={20}>
              <Button type="primary" onClick={this.onSubmitClick}>搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table className="margin-top-sm" columns={this.columns()} pagination={this.pagination()} loading={categories.isLoading} dataSource={categories.items} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
