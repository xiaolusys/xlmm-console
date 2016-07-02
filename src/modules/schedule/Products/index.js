import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Dropdown, Menu, Button, DatePicker, Table } from 'antd';
import * as constants from 'constants';
// import * as actionCreators from 'redux/modules/schedule/schedule';
import _ from 'lodash';

// @connect(
//   state => ({
//   }),
//   dispatch => bindActionCreators(actionCreators, dispatch),
// )
export class Products extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    fetchSchedule: React.PropTypes.func,
    schedule: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'schedule-products',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  componentWillMount() {
    console.log('initialize products');
    // this.props.fetchSchedule();
  }

  render() {
    const { prefixCls } = this.props;
    const { schedule } = this.props;
    return (
      <div className={`${prefixCls}`} >
      </div>
    );
  }
}
