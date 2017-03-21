import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import {fetchPacakgeOrder} from 'redux/modules/packageOrder/packageOrder';

const actionCreators = {
fetchPacakgeOrder,
};

@connect(state => ({
	packageorder:state.packageorder,
       packageOrders:state.packageOrders,
}),
dispatch => bindActionCreators(actionCreators, dispatch),
)

class Packageorder extends Component{
  static propTypes = {
    packageOrders: React.PropTypes.object,
    packageorder: React.PropTypes.object,
    fetchPacakgeOrder: React.PropTypes.func,
  };

    static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

	  componentWillMount() {
	  	console.log(this.props.packageorder);
	  	console.log("start get http data");
	  	this.props.fetchPacakgeOrder();
	  	
	  	
	  }

  	  componentWillReceiveProps(nextProps) {
  	  	console.log("nextProps",nextProps);
  		console.log(nextProps.packageorder);
  }

	  render() {
	  	console.log(this.props.packageorder)
	      return (<div>12313</div>)
	  }
}

export const Home = Form.create()(Packageorder);

