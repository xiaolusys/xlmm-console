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
import { fetchDeliveryStats } from 'redux/modules/statistics/categorys';

const actionCreators = {
  fetchDeliveryStats,
};

@connect(
  state => ({
    categoriesStats: state.categoriesStats,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class DeliveryWithForm extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    categoriesStats: React.PropTypes.object,
    fetchDeliveryStats: React.PropTypes.func,
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
    const today = new Date();
    this.setFilters({
        dateRange: [moment(new Date().setDate(today.getDate() - 1)), moment(today)],
      });
    this.getDeliveryStatsData(); // 使用默认日期(昨日)
  }

  componentWillReceiveProps(nextProps) {
    const { categoriesStats } = nextProps;
    if (categoriesStats.failure) {
      message.error(`请求错误: ${toErrorMsg(categoriesStats.error)}`);
    }
  }

  onSubmitClick = (e) => {
    const filters = this.props.form.getFieldsValue();
    this.getDeliveryStatsData();
  }

  onDateRangeChange = (dates, dateStrings) => {
    this.setFilters({ dateRange: dates });
  }

  getDeliveryStatsData = () => {
    const { dateRange } = this.state.filters;
    console.log('dateRange', dateRange);
    if (dateRange) {
      this.props.fetchDeliveryStats(
        moment(dateRange[0]).format('YYYY-MM-DD'),
        moment(dateRange[1]).format('YYYY-MM-DD')
      );
    }
  }

  getFilterSelectValue = (field) => {
    const fieldValue = this.state.filters[field];
    console.log('dateRange', fieldValue);
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
      width: 200,
    }, {
      title: '发货速度(按天)',
      className: 'cyan-3',
      children: [{
          title: '1d',
          dataIndex: 'serialData.1.postNum',
          key: 'serialData.1.postNum',
          width: 50,
        }, {
          title: '2d',
          dataIndex: 'serialData.2.postNum',
          key: 'serialData.2.postNum',
          width: 50,
        }, {
          title: '3d',
          dataIndex: 'serialData.3.postNum',
          key: 'serialData.3.postNum',
          width: 50,
        }, {
          title: '4d',
          dataIndex: 'serialData.4.postNum',
          key: 'serialData.4.postNum',
          width: 50,
        }, {
          title: '5d',
          dataIndex: 'serialData.5.postNum',
          key: 'serialData.5.postNum',
          width: 50,
        }, {
          title: '6d',
          dataIndex: 'serialData.6.postNum',
          key: 'serialData.6.postNum',
          width: 50,
        }, {
          title: '7d+',
          dataIndex: 'serialData.inf.postNum',
          key: 'serialData.inf.postNum',
          width: 50,
        },
      ],
    },
    {
      title: '待发延迟(按天)',
      className: 'purple-3',
      children: [{
          title: '1d',
          dataIndex: 'serialData.1.waitNum',
          key: 'serialData.1.waitNum',
          width: 50,
        }, {
          title: '2d',
          dataIndex: 'serialData.2.waitNum',
          key: 'serialData.2.waitNum',
          width: 50,
        }, {
          title: '3d',
          dataIndex: 'serialData.3.waitNum',
          key: 'serialData.3.waitNum',
          width: 50,
        }, {
          title: '4d',
          dataIndex: 'serialData.4.waitNum',
          key: 'serialData.4.waitNum',
          width: 50,
        }, {
          title: '5d',
          dataIndex: 'serialData.5.waitNum',
          key: 'serialData.5.waitNum',
          width: 50,
        }, {
          title: '6d',
          dataIndex: 'serialData.6.waitNum',
          key: 'serialData.6.waitNum',
          width: 50,
        }, {
          title: '7d+',
          dataIndex: 'serialData.inf.waitNum',
          key: 'serialData.inf.waitNum',
          width: 50,
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
              <Button type="primary" >搜索</Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this.columns()}
          dataSource={[categoriesStats.delivery.serialData || {}]}
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

export const Deliverys = Form.create()(DeliveryWithForm);
