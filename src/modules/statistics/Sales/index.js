import React, { Component } from 'react';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm, message } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { toErrorMsg } from 'utils/object';
import { fetchSaleStats } from 'redux/modules/statistics/categorys';

const actionCreators = {
  fetchSaleStats,
};

@connect(
  state => ({
    categoriesStats: state.categoriesStats,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class SaleWithForm extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    categoriesStats: React.PropTypes.object,
    fetchSaleStats: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'statistics-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    filters: {
      dateRange: [],
    },
  }

  componentWillMount() {
    const yesterday = new Date().setDate(new Date().getDate() - 1);
    this.setFilters({
        dateRange: [moment(yesterday), moment(yesterday)],
      });
    this.getSaleStatsData(); // 使用默认日期(昨日)
  }

  componentWillReceiveProps(nextProps) {
    const { categoriesStats } = nextProps;
    if (categoriesStats.failure) {
      message.error(`请求错误: ${toErrorMsg(categoriesStats.error)}`);
    }
  }

  onSubmitClick = (e) => {
    this.getSaleStatsData();
  }

  onDateRangeChange = (dates, dateStrings) => {
    this.setFilters({ dateRange: dates });
  }

  getSaleStatsData = () => {
    const { dateRange } = this.state.filters;
    console.log('dateRange', dateRange);
    if (dateRange) {
      this.props.fetchSaleStats(
        moment(dateRange[0]).format('YYYY-MM-DD'),
        moment(dateRange[1]).format('YYYY-MM-DD')
      );
    }
  }

  getFilterSelectValue = (field) => {
    const fieldValue = this.state.filters[field];
    return fieldValue ? { value: fieldValue } : {};
  }

  setFilters = (filters) => {
    this.setState(assign(this.state.filters, filters));
  }

  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 12 },
  })

  columns = () => {
    console.log('columns');
    return [{
        title: '类目名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      }, {
        title: '销售数据(按天)',
        className: 'cyan-3',
        width: 300,
        children: [{
            title: '销售额',
            dataIndex: 'serialData.saleAmount',
            key: 'serialData.saleAmount',
            width: 50,
            sorter: (a, b) => (a.serialData.saleAmount - b.serialData.saleAmount),
            render: (data) => ((data * 0.01).toFixed(2)),
          }, {
            title: '商品总价',
            dataIndex: 'serialData.totalAmount',
            key: 'serialData.totalAmount',
            width: 50,
            sorter: (a, b) => (a.serialData.totalAmount - b.serialData.totalAmount),
            render: (data) => ((data * 0.01).toFixed(2)),
          }, {
            title: '直接支付',
            dataIndex: 'serialData.directPayment',
            key: 'serialData.directPayment',
            width: 50,
            sorter: (a, b) => (a.serialData.directPayment - b.serialData.directPayment),
            render: (data) => ((data * 0.01).toFixed(2)),
          }, {
            title: '券支付',
            dataIndex: 'serialData.couponPayment',
            key: 'serialData.couponPayment',
            width: 50,
            sorter: (a, b) => (a.serialData.couponPayment - b.serialData.couponPayment),
            render: (data) => ((data * 0.01).toFixed(2)),
          }, {
            title: '兑券价差',
            dataIndex: 'serialData.exchgAmount',
            key: 'serialData.exchgAmount',
            width: 50,
            sorter: (a, b) => (a.serialData.exchgAmount - b.serialData.exchgAmount),
            render: (data) => ((data * 0.01).toFixed(2)),
          },
        ],
      }, {
        title: '精品券(按天)',
        className: 'purple-3',
        width: 150,
        children: [{
            title: '券销量',
            dataIndex: 'serialData.couponSaleNum',
            key: 'serialData.couponSaleNum',
            width: 50,
            sorter: (a, b) => (a.serialData.couponSaleNum - b.serialData.couponSaleNum),
          }, {
            title: '券使用量',
            dataIndex: 'serialData.couponUseNum',
            key: 'serialData.couponUseNum',
            width: 50,
            sorter: (a, b) => (a.serialData.couponUseNum - b.serialData.couponUseNum),
          }, {
            title: '退券量',
            dataIndex: 'serialData.couponRefundNum',
            key: 'serialData.couponRefundNum',
            width: 50,
            sorter: (a, b) => (a.serialData.couponRefundNum - b.serialData.couponRefundNum),
          },
        ],
      }, {
        title: '商品数据(按天/库存算初始日期值)',
        className: 'purple-3',
        width: 150,
        children: [{
            title: '库存量',
            dataIndex: 'serialData.modelStockNum',
            key: 'serialData.modelStockNum',
            width: 50,
            sorter: (a, b) => (a.serialData.modelStockNum - b.serialData.modelStockNum),
          }, {
            title: '销售量',
            dataIndex: 'serialData.modelSaleNum',
            key: 'serialData.modelSaleNum',
            width: 50,
            sorter: (a, b) => (a.serialData.modelSaleNum - b.serialData.modelSaleNum),
          }, {
            title: '退款(货)数',
            dataIndex: 'serialData.modelRefundNum',
            key: 'serialData.modelRefundNum',
            width: 50,
            sorter: (a, b) => (a.serialData.modelRefundNum - b.serialData.modelRefundNum),
          },
        ],
      },
    ];
  };

  render() {
    const { prefixCls, categoriesStats } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Col sm={8}>
              <Form.Item label="日期" {...this.formItemLayout()} >
                <DatePicker.RangePicker
                  {...getFieldProps('dateRange')}
                  {...this.getFilterSelectValue('dateRange')}
                  onChange={this.onDateRangeChange}
                  labelInValue
                  />
              </Form.Item>
            </Col>
            <Col span={2} offset={0}>
              <Button type="primary" onClick={this.onSubmitClick} >搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns()}
          dataSource={[categoriesStats.sales.serialData || {}]}
          bordered
          rowKey="id"
          pagination={false}
          loading={categoriesStats.isLoading}
          size="middle"
          />
      </div>
    );
  }
}

export const Sales = Form.create()(SaleWithForm);
