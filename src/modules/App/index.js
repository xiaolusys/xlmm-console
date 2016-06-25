import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { Sider } from 'components/Sider';
import { Header } from 'components/Header';

import './styles/index.less';

export class App extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  static defaultProps = {
    prefixCls: 'console',
  };

  render() {
    const { prefixCls, children } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Header />
        <Sider />

      </div>
    );
  }
}
