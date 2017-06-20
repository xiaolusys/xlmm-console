import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { If } from 'jsx-control-statements';
import _ from 'lodash';

import './index.less';

export class Sider extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    theme: React.PropTypes.any,
    location: React.PropTypes.any,
    menu: React.PropTypes.array,
    selectedKeys: React.PropTypes.string,
    defaultOpenKeys: React.PropTypes.array,
    onMenuClick: React.PropTypes.func,
  };

  static defaultProps = {
    prefixCls: 'sider-menu',
    theme: 'dark',
    onMenuClick: _.noop,
  };

  render() {
    const { prefixCls, theme, menu, selectedKeys, defaultOpenKeys, onMenuClick } = this.props;
    return (
      <aside className={`${prefixCls}`}>
        <Menu theme={theme} defaultOpenKeys={defaultOpenKeys} selectedKeys={selectedKeys} mode="inline" onClick={onMenuClick}>
          {menu.map((item) => {
            if (!item.sub) {
              return (
                <Menu.Item key={item.link} >
                  <If condition={item.external || null}>
                    <a target="_blank" href={item.link}><Icon type={item.icon} />{item.name}</a>
                  </If>
                  <If condition={!item.external}>
                    <Icon type={item.icon} /><span>{item.name}</span>
                  </If>
                </Menu.Item>
              );
            }
            return (
              <Menu.SubMenu key={item.link} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                {item.sub.map((sub) => (
                  <Menu.Item key={sub.link}>
                    <If condition={sub.external || null}>
                      <a target="_blank" href={sub.link}><Icon type={sub.icon} />{sub.name}</a>
                    </If>
                    <If condition={!sub.external}>
                      <Icon type={sub.icon} />{sub.name}
                    </If>
                  </Menu.Item>
                  ))}
              </Menu.SubMenu>
            );
          })}
        </Menu>
      </aside>
    );
  }
}
