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
        <div>
          <h2>
            <Link to="operations/changemmupper" >更改上级妈妈</Link>
          </h2>
        </div>
      </TabPane>
      <TabPane tab="精品券" key="2">
        <div>
          <h2>
            <Link to="operations/gifttransfercoupon" >赠送精品券</Link>
          </h2>
        </div>
        <div>
          <h2>
            <Link to="operations/sendelitescore" >赠送精品积分</Link>
          </h2>
        </div>
      </TabPane>
      <TabPane tab="普通用户" key="3">
        <div>
          <h2>
            <Link to="operations/sendenvelopuserbudget" >用户钱包发送红包</Link>
          </h2>
        </div>
      </TabPane>
    </Tabs>
  </div>);
  }
}

export const Oprations = Form.create()(Panes);
