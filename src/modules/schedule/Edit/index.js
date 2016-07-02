import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form } from 'antd';
import { Modals } from 'modules/components/Modals';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/schedule/schedule';
import _ from 'lodash';

@connect(
  state => ({}),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditSchedule extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchSchedule: React.PropTypes.func,
    schedule: React.PropTypes.object,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    suppliers: [
      { id: 1, name: '上海己美网络科技有限公司' },
      { id: 2, name: '上海己美网络科技有限公司' },
      { id: 3, name: '上海己美网络科技有限公司' },
      { id: 3, name: '上海己美网络科技有限公司' },
      { id: 5, name: '上海己美网络科技有限公司' },
    ],
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchSchedule(id);
    }
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 3 },
  })

  render() {
    const { prefixCls, schedule } = this.props;
    const { getFieldProps } = this.props.form;
    const { suppliers } = this.state;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal onSubmit={this.onSubmitCliick}>
          <Form.Item {...this.formItemLayout()} label="日期">
            <DatePicker {...getFieldProps('saleTime')} />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类型">
            <Select placeholder="请选择排期类型" style={{ width: 200 }} {...getFieldProps('scheduleType')}>
            {_.map(constants.scheduleTypes, (type) => (<Select.Option value={type.id}>{type.lable}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 10 }} label="供应商">
            {_.map(suppliers, (supplier) => (<Tag closable key={supplier.id} afterClose={this.removeSupplier}>{supplier.name}</Tag>))}
            <Button style={{ margin: '4px 0' }} size="small" type="dashed" onClick={this.onAddSupplierClick}>+ 添加供应商</Button>
          </Form.Item>
        </Form>
        <Modals.VendorList visible />
      </div>
    );
  }
}

export const Edit = Form.create()(EditSchedule);
