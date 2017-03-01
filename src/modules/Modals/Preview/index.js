import React, { Component } from 'react';
import { Modal } from 'antd';

import './index.less';

export default class Preview extends Component {

  static propTypes = {
    title: React.PropTypes.string,
    url: React.PropTypes.string,
    visible: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
  };

  componentWillMount() {

  }

  render() {
    const { title, url, visible, onCancel } = this.props;
    return (
      <Modal title={title} footer={null} visible={visible} onCancel={onCancel} closable maskClosable>
        <div className="device-iphone6 clearfix">
          <div classNameName="top-bar">
            <span className="camera"></span>
            <span className="speaker-before"></span>
            <span className="speaker"></span>
          </div>
          <span className="home"></span>
          <div className="screen">
            <iframe src={url} style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
        </div>
      </Modal>
    );
  }

}
