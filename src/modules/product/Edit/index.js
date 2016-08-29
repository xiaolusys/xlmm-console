import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Input, Table, Tabs, Modal, Steps } from 'antd';

class EditWithForm extends Component {

  static propTypes = {
    prefixCls: React.PropTypes.string,
    location: React.PropTypes.any,
    form: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'product-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  render() {
    const { prefixCls } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Tabs defaultActiveKey="basic" onChange={this.onTabChange}>
          <Tabs.TabPane tab="基本信息" key="basic">
            基本信息
          </Tabs.TabPane>
          <Tabs.TabPane tab="完善资料" key="material">
            完善资料
          </Tabs.TabPane>
          <Tabs.TabPane tab="上传图片" key="images">
            上传图片
          </Tabs.TabPane>
        </Tabs>
        <Modal title="抓取商品" width={800} visible>
          <div style={{ minHeight: 600 }}>
            <Tabs defaultActiveKey="supplier" onChange={this.onTabChange}>
              <Tabs.TabPane tab="选择供应商" key="supplier">
                选择供应商
              </Tabs.TabPane>
              <Tabs.TabPane tab="抓取商品" key="product" disabled>
                抓取商品
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }

}


export const Edit = Form.create()(EditWithForm);
