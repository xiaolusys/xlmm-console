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

@connect(
  state => ({
   packageOrder: state.packageOrder,
}),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class PackageOrders extends Component{
  static propTypes = {
    packageOrder: React.PropTypes.object,
    fetchPacakgeOrder: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
      pageSize:15,
      page:1,
  }

  setPage = () =>{
    // this.setState(assign(this.state.page, 100));
    this.setState({page:100});
    // console.log(this.state.page);
  }

  // onClicknmb = ()=>{
  //   console.log("fdafdsa");
  //   this.setPage();
  //   console.log(this.state.page);
  // }

  getPage = () => {
    return this.state.page
  }
  componentWillMount() {
  	console.log(this.props.packageorder);
  	console.log("start get http data");
  	this.props.fetchPacakgeOrder();
  }

  columns = () =>{
    const self = this;
    return [{
      title:"包裹单号",
      dataIndex:"pid",
      key:"pid",
    },
    {
      title:"交易单号",
      dataIndex:"tid",
      key:"tid",
    },
    {
      title:"所属仓库",
      dataIndex:"wareBy",
      key:"wareBy",
    },
    {
      title:"系统状态",
      dataIndex:"sysStatus",
      key:"sysStatus",
    },
    {
      title:"是否备货完毕",
      dataIndex:"readyCompletion",
      key:"readyCompletion",
    },
    {
      title:"卖家ID",
      dataIndex:"sellerId",
      key:"sellerId"
    },
    {
      title:"发货类型",
      dataIndex:"actionType",
      key:"actionType",
    },
    {
      title:"收货人姓名",
      dataIndex:"receiverName",
      key:"receiverName",
    },
        {
      title:"省",
      dataIndex:"receiverState",
      key:"receiverState",
    },
        {
      title:"市",
      dataIndex:"receiverCity",
      key:"receiverCity",
    },
        {
      title:"区",
      dataIndex:"receiverDistrict",
      key:"receiverDistrict",
    },
        {
      title:"详细地址",
      dataIndex:"receiverAddress",
      key:"receiverAddress",
    },
    {
      title:"手机",
      dataIndex:"receiverMobile",
      key:"receiverMobile",
    },
    {
      title:"买家ID",
      dataIndex:"buyerId",
      key:"buyerId",
    },
        {
      title:"买家昵称",
      dataIndex:"buyerNick",
      key:"buyerNick",
    },
    {
      title:"物流编号",
      dataIndex:"outSid",
      key:"outSid",
    },
    {
      title:"物流公司",
      dataIndex:"logisticsCompany",
      key:"logisticsCompany",
    },
    {
      title:"生成日期",
      dataIndex:"created",
      key:"created",
    },
    {
      title:"称重日期",
      dataIndex:"weight_time",
      key:"weight_time",
    },
    {
      title:"重做标志",
      dataIndex:"redoSign",
      key:"redoSign",
    },


    ]
  }

  tableProps = () => {
    const self = this;
    const count = this.props.packageOrder.count;
    const items = this.props.packageOrder.items;
    const itemsLength = items.length;
    function onChange(pageNumber) {
            self.setPage(pageNumber);
            self.props.fetchPacakgeOrder({"page":pageNumber});

      }
    
    return {
      className : "margin-top-sm",
      rowKey:(record) => (record.id),
      rowSelection:{
        onChange:(selectedRowKeys,selectedRows) =>{
          const selected = map(selectedRows,(row) => ({
            id:row.id,name:row.title
          }));
          self.setSelected(selected);
        },
      },
      dataSource: items,
      pagination:{
        defaultPageSize : 15,
        total : count,
        onChange: onChange,
        },
                }

    }


  // componentWillReceiveProps(nextProps) {
  //   console.log("nextProps",nextProps);
  //   console.log(nextProps.packageorder);
  // }

  render() {
	   return (
              <div >
              {this.state.page}
              // <Button onClick={this.onClicknmb}/>
              <Table {...this.tableProps()} columns={this.columns()} />
              </div>
      )
	  }
}

export const Home = Form.create()(PackageOrders);

