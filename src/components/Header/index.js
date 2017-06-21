import React, { Component } from 'react';
import { Row, Col } from 'antd';

import logo from './images/logo.png';

import './index.less';

export class Header extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
  };

  static defaultProps = {
    prefixCls: 'header-bar',
  };

  loginoutClick = (e) => {
    window.location.replace('/admin/logout/?next=/console/#/');
  }

  render() {
    const { prefixCls } = this.props;
    return (
      <header className={`${prefixCls}`}>
        <Row type="flex">
          <Col span="3">
            <div className={`${prefixCls}-logo`}><img src={logo} alt="小鹿美美" /></div>
          </Col>
          <Col span="21">
            <div className={`${prefixCls}-logo pull-right`}><button onClick={this.loginoutClick}>退出</button></div>
          </Col>
        </Row>
      </header>
    );
  }
}
