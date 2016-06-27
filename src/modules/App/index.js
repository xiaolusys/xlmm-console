import React, { Component } from 'react';
import { Row, Col, Breadcrumb } from 'antd';
import { Sider } from 'components/Sider';
import { Header } from 'components/Header';
import * as constants from 'constants';

import './styles/index.less';

export class App extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'console',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    currentKey: constants.menu[0].link,
  }

  onMenuClick = (e) => {
    this.setState({ currentKey: e.key });
    this.context.router.replace(e.key);
  }

  render() {
    const { prefixCls, children, ...props } = this.props;
    return (
      <div className={`${prefixCls}`}>
        <Header />
        <Sider menu={constants.menu} selectedKeys={this.state.currentKey} onMenuClick={this.onMenuClick} />
        <nav className={`${prefixCls}-nav`}>
          <Breadcrumb {...props} separator="/" />
        </nav>
        <div className={`${prefixCls}-container`}>
          {children}
        </div>
      </div>
    );
  }
}
