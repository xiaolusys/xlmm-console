import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm, Search, Icon } from 'antd';
import { assign, noop, map } from 'lodash';
import moment from 'moment';
import stringcase from 'stringcase';
import { fetchPacakgeOrders } from 'redux/modules/packageOrder/packageOrder';
import { fetchPackageOrderFilters } from 'redux/modules/packageOrder/packageOrderFilter';

const actionCreators = {
  fetchPacakgeOrders,
  fetchPackageOrderFilters,
};

@connect(
  state => ({
   packageOrder: state.packageOrder,
   packageOrderFilters: state.packageOrderFilter,

}),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class PackageOrders extends Component {
  static propTypes = {
    packageOrder: React.PropTypes.object,
    fetchPacakgeOrders: React.PropTypes.func,
    packageOrderFilters: React.PropTypes.object,
    fetchPackageOrderFilters: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
      pageSize: 15,
      page: 1,
      ordering: '-pid',
      value: '',
      wareBy: [],
      sysStatus: [],
      selectWareBy: '',
      selectSysStatus: '',
      inputSearchFocus: 1,
      SelectFocus: 1,
  }
  // onClicknmb = ()=>{
  //   console.log("fdafdsa");
  //   this.setPage();
  //   console.log(this.state.page);
  // }
  componentWillMount() {
    this.props.fetchPacakgeOrders({ ordering: this.state.ordering });
    this.props.fetchPackageOrderFilters();
  }
  componentWillReceiveProps(nextProps) {
    const wareBy = nextProps.packageOrderFilters.wareBy;
    const sysStatus = nextProps.packageOrderFilters.sysStatus;
    this.setState({ wareBy: wareBy });
    this.setState({ sysStatus: sysStatus });
  }
  onSearch = (value) => {
    this.setState({ searchValue: value });
    this.props.fetchPacakgeOrders({ ordering: this.state.ordering, search: value });
  }
  getSelectWareBy = (value) => {
    this.setState({ SelectFocus: this.state.SelectFocus * (-1) });
    this.setState({ selectWareBy: value.key });
    const params = { sysStatus: this.state.selectSysStatus,
      wareBy: value.key,
      ordering: this.state.ordering };
    this.props.fetchPacakgeOrders(params);
  }
  setPage = () => {
    this.setState({ page: 100 });
  }
  getSelectSysStatus = (value) => {
    this.setState({ SelectFocus: this.state.SelectFocus * (-1) });
    this.setState({ selectSysStatus: value.key });
    const params = { sysStatus: value.key,
      wareBy: this.state.selectWareBy,
      ordering: this.state.ordering };
    this.props.fetchPacakgeOrders(params);
  }
  inputOnFocus = () => {
    this.setState({ inputSearchFocus: this.state.inputSearchFocus * (-1) });
  }

  columns = () => {
    const self = this;
    return [{
      title: '包裹单号',
      dataIndex: 'pid',
      key: 'pid',
      sorter: true,
    },
    {
      title: '包裹码',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: '交易单号',
      dataIndex: 'tid',
      key: 'tid',
      sorter: true,
    },
    {
      title: '系统状态',
      dataIndex: 'getSysStatusDisplay',
      key: 'getSysStatusDisplay',
      sorter: true,
    },
    {
      title: '物流编号',
      dataIndex: 'outSid',
      key: 'outSid',
      sorter: true,
    },
    {
      title: '物流公司',
      dataIndex: 'logisticsCompanyName',
      key: 'LogisticsCompanyName',
      sorter: true,
    },
    {
      title: '收货人姓名',
      dataIndex: 'receiverName',
      key: 'receiverName',
    },
    {
      title: '手机',
      dataIndex: 'receiverMobile',
      key: 'receiverMobile',
    },
    {
      title: '详细地址',
      dataIndex: 'receiverAddress',
      key: 'receiverAddress',
    },
    {
      title: '打单员',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '发货单',
      dataIndex: 'isPickingPrint',
      key: 'isPickingPrint',
      render: (isPickingPrint) => (<span>{isPickingPrint ? <Icon type="check" /> : <Icon type="close" />}</span>),
    },
    {
      title: '物流单',
      dataIndex: 'isExpressPrint',
      key: 'isExpressPrint',
      render: (isExpressPrint) => (<span>{isExpressPrint ? <Icon type="check" /> : <Icon type="close" />}</span>),
    },
    {
      title: '仓库',
      dataIndex: 'getWareByDisplay',
      key: 'getWareByDisplay',
      sorter: true,
    },
    {
      title: '包裹类型',
      dataIndex: 'getPackageTypeDisplay',
      key: 'getPackageTypeDisplay',
      sorter: true,
    },
    {
      title: '称重日期',
      dataIndex: 'weightTime',
      key: 'weightTime',
      sorter: true,
    },
    {
      title: '操作',
      dataIndex: 'pid',
      key: 'operation',
      render: (pid, record) => (
        <span>
          <Link to={`packageorder/editwuliu?pid=${pid}`}>详情</Link>
        </span>
        ),
    },
    ];
  }

  tableProps = () => {
    const self = this;
    const count = this.props.packageOrder.count;
    const items = this.props.packageOrder.items;
    for (const i of items) {
      if (i.isExpressPrint === true) {
        i.isExpressPrint = 1;
      } else {
        i.isExpressPrint = 0;
      }
      if (i.isPickingPrint === true) {
        i.isPickingPrint = 1;
      } else {
        i.isPickingPrint = 0;
      }
      if (i.redoSign === true) {
        i.redoSign = 1;
      } else {
        i.redoSign = 0;
      }
      if (i.isSendSms === true) {
        i.isSendSms = 1;
      } else {
        i.isSendSms = 0;
      }
      if (i.hasRefund === true) {
        i.hasRefund = 1;
      } else {
        i.hasRefund = 0;
      }
    }
    const itemsLength = items.length;
    function onChange(pageNumber) {
            self.setPage(pageNumber);
            const pageNum = { page: pageNumber };
            const params = { page: pageNumber,
            wareBy: self.state.selectWareBy,
            sysStatus: self.state.selectSysStatus,
            ordering: self.state.ordering };
            self.props.fetchPacakgeOrders(params);

      }
    return {
      rowKey: (record) => (record.id),
      dataSource: items,
      pagination: {
        total: count || 0,
        showTotal: total => `共 ${total} 条`,
        defaultPageSize: 15,
        onChange: onChange,
        },
    };
    }

  render() {
    let sysStatusSelect = (<Select labelInValue placeholder="请选择包裹状态" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectSysStatus(value)}>
            {map(this.state.sysStatus, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
    </Select>);
    let wareBySelect = (<Select labelInValue placeholder="请选择仓库" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectWareBy(value)}>
            {map(this.state.wareBy, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
    </Select>);
    let inputSearch = <Input.Search onFocus={() => this.inputOnFocus()}style={{ width: 250 }} onSearch={value => this.onSearch(value)} placeholder="输入手机号,物流编号或包裹号搜索" />;
    let sysStatusSelect2 = <div></div>;
    let wareBySelect2 = <div></div>;
    let inputSearch2 = <div></div>;
    if (this.state.inputSearchFocus === -1) {
      sysStatusSelect = <div></div>;
      wareBySelect = <div></div>;
      sysStatusSelect2 = (<Select labelInValue placeholder="请选择包裹状态" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectSysStatus(value)}>
            {map(this.state.sysStatus, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
      </Select>);
      wareBySelect2 = (<Select labelInValue placeholder="请选择仓库" notFoundContent="无可选项" style={{ width: 120 }} onChange={value => this.getSelectWareBy(value)}>
            {map(this.state.wareBy, (item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
      </Select>);
    }
    if (this.state.SelectFocus === -1) {
      inputSearch = <div></div>;
      inputSearch2 = <Input.Search onFocus={() => this.inputOnFocus()}style={{ width: 250 }} onSearch={value => this.onSearch(value)} placeholder="输入手机号,物流编号或包裹号搜索" />;
    }
    return (
      <div >
        <Row type="flex" justify="start" align="middle">
          <Col span={2} >
          {sysStatusSelect}
          {sysStatusSelect2}
          </Col>
          <Col span={2} >
          {wareBySelect}
          {wareBySelect2}
          </Col>
          <Col span={4} offset={15}>
          {inputSearch}
          {inputSearch2}
          </Col>
        </Row>
        <br />
        <Table {...this.tableProps()} columns={this.columns()} />
      </div>
      );
   }
}

export const Home = Form.create()(PackageOrders);

