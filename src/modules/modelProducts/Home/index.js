import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import { fetchModelProducts, deleteModelProducts } from 'redux/modules/products/modelProducts';

const actionCreators = {
  fetchModelProducts,
  deleteModelProducts,
};

@connect(
  state => ({
    modelProducts: state.modelProducts,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchModelProducts: React.PropTypes.func,
    deleteModelProducts: React.PropTypes.func,
    modelProducts: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'products-home',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    /*  filters: {
        pageSize: 10,
        page: 1,
      },*/
  }

  componentWillMount() {
    this.props.fetchModelProducts();
  }

  onCreateModelProductClick = (e) => {
    this.context.router.push('stockproduct/edit');
  }

  onDeleteClick = (e) => {
    const { modelproductid } = e.currentTarget.dataset;
    this.props.deleteModelProducts(modelproductid);
  }


  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    }, {
      title: '图片',
      key: 'headImgs',
      dataIndex: 'headImgs',
      width: 100,
      // render: (head_imgs, record) => {
        // const conetnt = (<img style={{ height: '360px' }} src=`{head_imgs}` role="presentation" />);
        // return (
        //   <Popover placement="right" content={conetnt} trigger="hover">
        //     <img style={{ height: '80px' }} src={head_imgs} role="presentation" />
        //   </Popover>
        // );
      // },
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    }, {
      title: '上架状态',
      dataIndex: 'shelfStatus',
      key: 'shelfStatus',
    }, {
      title: '上架时间',
      dataIndex: 'onshelfTime',
      key: 'onshelfTime',
    }, {
      title: '下架时间',
      dataIndex: 'offshelfTime',
      key: 'offshelfTime',
    }];
  }

  render() {
    const { prefixCls, modelProducts } = this.props;
    const { getFieldProps } = this.props.form;
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateModelProductClick}>新建售卖款式</Button>
        <Table className="margin-top-sm" rowKey={(record) => (record.cid)} columns={this.columns()} dataSource={modelProducts.results} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
