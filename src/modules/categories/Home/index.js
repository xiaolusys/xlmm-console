import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Icon, Select, Menu, Button, DatePicker, Table, Popover, Form } from 'antd';
import * as constants from 'constants';
import * as actionCreators from 'redux/modules/supplyChain/categories';
import { assign, map } from 'lodash';
import moment from 'moment';

@connect(
  state => ({
    categories: state.categories,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class List extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
    fetchCategories: React.PropTypes.func,
    deleteCategory: React.PropTypes.func,
    categories: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'categories-home',
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
    this.props.fetchCategories();
  }

  onCreateCategoryClick = (e) => {
    this.context.router.push('categories/edit');
  }

  onDeleteClick = (e) => {
    const { categoryid } = e.currentTarget.dataset;
    this.props.deleteCategory(categoryid);
  }


  formItemLayout = () => ({
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  })

  columns = () => {
    const self = this;
    return [{
      title: '图片',
      key: 'catPic',
      dataIndex: 'catPic',
      width: 100,
      render: (catPic, record) => {
        const conetnt = (<img style={{ height: '360px' }} src={catPic} role="presentation" />);
        return (
          <Popover placement="right" content={conetnt} trigger="hover">
            <img style={{ height: '80px' }} src={catPic} role="presentation" />
          </Popover>
        );
      },
    }, {
      title: '类目ID',
      dataIndex: 'cid',
      key: 'cid',
      width: 100,
    }, {
      title: '父类目ID',
      dataIndex: 'parentCid',
      key: 'parentCid',
    }, {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      dataIndex: 'cid',
      key: 'id',
      render: (id) => (
        <span>
          <Link to={`categories/edit?id=${id}`}>编辑</Link>
          <span className="ant-divider"></span>
          <a data-categoryid={id} onClick={self.onDeleteClick}>删除</a>
        </span>
      ),
    }];
  }

  render() {
    const { prefixCls, categories } = this.props;
    const { getFieldProps } = this.props.form;
    console.log(categories.items);
    return (
      <div className={`${prefixCls}`} >
        <Button type="primary" onClick={this.onCreateCategoryClick}>新建类目</Button>
        <Table className="margin-top-sm" rowKey={(record) => (record.cid)} columns={this.columns()} loading={categories.isLoading} dataSource={categories.items} />
      </div>
    );
  }
}


export const Home = Form.create()(List);
