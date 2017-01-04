import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Tabs, Form } from 'antd';
import * as constants from 'constants';
import { assign, map } from 'lodash';
import stringcase from 'stringcase';
import moment from 'moment';

const TabPane = Tabs.TabPane;

function callback(key) {
  console.log(key);
}

class Panes extends TabPane {
  render() {
  return (<div>
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab="小鹿妈妈" key="1">
        <Link to="operations/changemmupper" >更改上级妈妈</Link>
      </TabPane>
      <TabPane tab="普通用户" key="2">
        test
      </TabPane>
    </Tabs>
  </div>);
  }
}

export const Oprations = Form.create()(Panes);
