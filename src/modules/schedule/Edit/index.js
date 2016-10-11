import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon } from 'antd';
import Modals from 'modules/Modals';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/schedule';
import _ from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    schedule: state.schedule,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class EditSchedule extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchSchedule: React.PropTypes.func,
    saveSchedule: React.PropTypes.func,
    resetSchedule: React.PropTypes.func,
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
    suppliers: [],
    modalVisible: false,
  }

  componentWillMount() {
    const { id } = this.props.location.query;
    if (id) {
      this.props.fetchSchedule(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { schedule } = nextProps;
    if (!schedule.isLoading && schedule.success && schedule.updated) {
      this.context.router.goBack();
    }
    if (!schedule.isLoading && schedule.success) {
      this.props.form.setFieldsInitialValue({
        upshelfTime: moment(schedule.upshelfTime).format('YYYY-MM-DD HH:mm:ss'),
        offshelfTime: moment(schedule.offshelfTime).format('YYYY-MM-DD HH:mm:ss'),
        scheduleType: schedule.scheduleType,
        lockStatus: schedule.lockStatus,
      });
      this.setState({ suppliers: _.map(schedule.saleSuppliers, (supplier) => ({ id: supplier.id, name: supplier.supplierName })) });
    }
  }

  componentWillUnmount() {
    this.props.resetSchedule();
  }

  onOkClick = (selected) => {
    const unionSuppliers = _.unionWith(this.state.suppliers, selected, _.isEqual);
    this.setState({ suppliers: unionSuppliers });
    this.toggleModalVisible();
  }

  onCloseTagClick = (e) => {
    const id = Number(e.currentTarget.parentNode.dataset.id);
    let { suppliers } = this.state;
    suppliers = _.remove(suppliers, (item) => (id !== item.id));
    this.setState({ suppliers: suppliers });
  }

  onSwitchChange = (checked) => {
    this.props.form.setFieldsValue({ lockStatus: checked });
  }

  onSubmitCliick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    this.props.saveSchedule(this.props.schedule.id, {
      saleTime: moment(params.upshelfTime).format('YYYY-MM-DD'),
      upshelfTime: moment(params.upshelfTime).format('YYYY-MM-DD HH:mm:ss'),
      offshelfTime: moment(params.offshelfTime).format('YYYY-MM-DD HH:mm:ss'),
      scheduleType: params.scheduleType,
      lockStatus: params.lockStatus,
      saleSuppliers: _.map(this.state.suppliers, (supplier) => (supplier.id)),
    });
  }

  toggleModalVisible = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 3 },
  })

  render() {
    const { prefixCls, schedule, form } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { suppliers } = this.state;
    return (
      <div className={`${prefixCls}`} >
        <Form horizontal onSubmit={this.onSubmitCliick}>
          <Form.Item {...this.formItemLayout()} label="开始时间">
            <DatePicker {...getFieldProps('upshelfTime')} value={getFieldValue('upshelfTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="结束时间">
            <DatePicker {...getFieldProps('offshelfTime')} value={getFieldValue('offshelfTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类型" >
            <Select style={{ width: 200 }} placeholder="请选择排期类型" {...getFieldProps('scheduleType')} value={getFieldValue('scheduleType')} required>
            {_.map(constants.scheduleTypes, (type) => (<Select.Option value={type.id}>{type.lable}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 10 }} label="供应商">
            {_.map(suppliers, (supplier) => (<Tag closable key={supplier.id} data-id={supplier.id} onClose={this.onCloseTagClick} >{supplier.name}</Tag>))}
            <Button style={{ margin: '4px 0' }} size="small" type="dashed" onClick={this.toggleModalVisible}>+ 添加供应商</Button>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="锁定">
            <Switch {...getFieldProps('lockStatus')} checked={getFieldValue('lockStatus')} onChange={this.onSwitchChange} required />
          </Form.Item>
          <Row>
            <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitCliick}>保存</Button></Col>
          </Row>
        </Form>
        <Modals.SupplierLib visible={this.state.modalVisible} onCancel={this.toggleModalVisible} onOk={this.onOkClick} />
      </div>
    );
  }
}

export const Edit = Form.create()(EditSchedule);
