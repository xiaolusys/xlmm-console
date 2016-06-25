import React, { Component } from 'react';

export class Home extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    location: React.PropTypes.any,
  };

  static defaultProps = {
    prefixCls: 'console',
  };

  render() {
    const { prefixCls } = this.props;
    return (
      <div className={prefixCls}>
        {this.props.children}
      </div>
    );
  }
}
