import React, { Component } from 'react';
import { Menu, Icon, Switch } from 'antd';

import './index.less';

const SubMenu = Menu.SubMenu;

export class Sider extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    theme: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  static defaultProps = {
    prefixCls: 'sider-menu',
    theme: 'dark',
  };

  state = {
    current: 'schedule',
  }

  render() {
    const { prefixCls, theme } = this.props;
    return (
      <side className={`${prefixCls}`}>
        <Menu theme={theme} defaultOpenKeys={['sub1']} selectedKeys={[this.state.current]} mode="inline" onClick={this.onMenuClick}>
          <Menu.Item key="schedule"><Icon type="calendar" /><span>排期管理</span></Menu.Item>
        </Menu>
      </side>
    );
  }
}
