import React, { Component } from 'react';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Alert, Button, Col, DatePicker, Input, Form, Row, Radio, Select, Table, Popconfirm, message } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { toErrorMsg, getDateRangeItems } from 'utils/object';
import { productTypes } from 'constants';
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
    dateRangeList: [],
    filters: {
      dateRange: [],
      productType: '0',
    },
  }

  componentWillMount() {
    this.state.dateRangeList = getDateRangeItems();
    console.log('dateRangeList', this.state.dateRangeList);
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

  onClickProductType = (e) => {
    const productType = e.target.value;
    this.setFilters({
      productType: productType,
    });
  }

  getSaleStatsData = () => {
    const { dateRange, productType } = this.state.filters;
    console.log('fetch:', productType);
    if (dateRange) {
      this.props.fetchSaleStats({
        startDate: moment(dateRange[0]).format('YYYY-MM-DD'),
        endDate: moment(dateRange[1]).format('YYYY-MM-DD'),
        productType: productType,
      });
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
        width: 120,
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
            title: '币支付',
            dataIndex: 'serialData.coinPayment',
            key: 'serialData.coinPayment',
            width: 50,
            sorter: (a, b) => (a.serialData.coinPayment - b.serialData.coinPayment),
            render: (data) => ((data * 0.01).toFixed(2)),
          }, {
            title: '兑券价差',
            dataIndex: 'serialData.exchgAmount',
            key: 'serialData.exchgAmount',
            width: 50,
            sorter: (a, b) => (a.serialData.exchgAmount - b.serialData.exchgAmount),
            render: (data) => ((data * 0.01).toFixed(2)),
          },
          {
            title: '采购成本',
            dataIndex: 'serialData.totalCost',
            key: 'serialData.totalCost',
            width: 50,
            sorter: (a, b) => (a.serialData.totalCost - b.serialData.totalCost),
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
        <Form inline horizontal className="ant-advanced-search-form">
          <Row type="flex" justify="start" align="middle">
            <Form.Item label="提示：">
              <Alert
                message="销售额=直接支付+券支付 / 直接支付:包含现金和钱包付款 / 券支付:是券实际购买付款金额 / 兑券价差:券兑出价值-券支付价值"
                type="Informational"
                />
            </Form.Item>
          </Row>
          <Row type="flex" justify="start" align="middle">
            <Col >
              <Form.Item label="日期" >
                <DatePicker.RangePicker
                  {...getFieldProps('dateRange')}
                  {...this.getFilterSelectValue('dateRange')}
                  onChange={this.onDateRangeChange}
                  ranges={this.state.dateRangeList}
                  labelInValue
                  />
              </Form.Item>
              <Form.Item>
                <Radio.Group
                  {...getFieldProps('productType')}
                  value={this.state.productType}
                  onChange={this.onClickProductType}>
                  {map(productTypes, (type) => (<Radio.Button value={type.id}>{type.lable}</Radio.Button>))}
                </Radio.Group>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={this.onSubmitClick} >搜索</Button>
              </Form.Item>
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
