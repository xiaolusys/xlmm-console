import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import request from 'superagent-bluebird-promise';
import { If } from 'jsx-control-statements';
import { Icon } from 'antd';
import classnames from 'classnames';
import { isEmpty } from 'lodash';

import './index.less';

const isFunction = function(fn) {
  const getType = {};
  return fn && getType.toString.call(fn) === '[object Function]';
};

export class Uploader extends Component {

  static propTypes = {
    token: React.PropTypes.string.isRequired,
    onDrop: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
    prefix: React.PropTypes.string,
    children: React.PropTypes.any,
    className: React.PropTypes.string,
    size: React.PropTypes.number,
    style: React.PropTypes.object,
    onUpload: React.PropTypes.func,
    supportClick: React.PropTypes.bool,
    accept: React.PropTypes.string,
    multiple: React.PropTypes.bool,
    uploadUrl: React.PropTypes.string,
    uploadKey: React.PropTypes.string,
    fileList: React.PropTypes.array,
  };

  static defaultProps = {
    prefix: 'upload/',
    size: 100,
    supportClick: true,
    multiple: true,
    uploadUrl: window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com',
  }

  state = {
    isDragActive: false,
  }

  onDragLeave = (e) => {
    this.setState({ isDragActive: false });
  }

  onDragOver = (e) => {
    const { dataTransfer } = e;
    e.preventDefault();
    dataTransfer.dropEffect = 'copy';
    this.setState({ isDragActive: true });
  }

  onDrop = (e) => {
    e.preventDefault();
    this.setState({ isDragActive: false });

    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }

    const maxFiles = (this.props.multiple) ? files.length : 1;
    if (this.props.onUpload) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onUpload(files, e);
    }

    for (let i = 0; i < maxFiles; i++) {
      files[i].preview = URL.createObjectURL(files[i]);
      files[i].request = this.upload(files[i]);
      files[i].uploadPromise = files[i].request.promise();
    }

    if (this.props.onDrop) {
      files = Array.prototype.slice.call(files, 0, maxFiles);
      this.props.onDrop(files, e);
    }

  }

  onClick = (e) => {
    if (this.props.supportClick) {
      this.open();
    }
  }

  upload = (file) => {
    const { uploadUrl } = this.props;
    if (!file || file.size === 0) return null;
    let key = `${file.preview.split('/').pop()}.${file.name.split('.').pop()}`;
    if (this.props.prefix) {
      key = this.props.prefix + key;
    }

    if (this.props.uploadKey) {
      key = this.props.uploadKey;
    }

    const req = request
      .post(this.props.uploadUrl)
      .field('key', key)
      .field('token', this.props.token)
      .field('x:filename', file.name)
      .field('x:size', file.size)
      .attach('file', file, file.name)
      .set('Accept', 'application/json');
    if (isFunction(file.onprogress)) {
      req.on('progress', file.onprogress);
    }
    return req;
  }

  open = (e) => {
    const fileInput = ReactDOM.findDOMNode(this.refs.fileInput);
    fileInput.value = null;
    fileInput.click();
  }

  showAdd = (multiple, fileList) => {
    if (multiple) {
      return true;
    }
    if (!multiple && isEmpty(fileList)) {
      return true;
    }
    return false;
  }

  render() {
    const { className, size, multiple, accept, fileList, onDelete } = this.props;

    const cls = classnames({
      active: this.state.active,
      dropzone: true,
      'uploader-item': true,
      [className]: !!className,
    });

    const uploaderStyle = this.props.style || {
      width: size,
      height: size,
      lineHeight: `${size}px`,
      fontSize: 28,
      borderStyle: this.state.isDragActive ? 'solid' : 'dashed',
    };

    const imageStyle = {
      width: size,
      height: size,
    };
    return (
      <div className="uploader-list">
        <If condition={!isEmpty(fileList)}>
          {fileList.map((file) => (
            <div className="uploader-item" style={imageStyle}>
              <img src={file.src} role="presentation" />
              <Icon type="cross" onClick={onDelete} />
            </div>
          ))}
        </If>
        <If condition={this.showAdd(multiple, fileList)}>
          <div className={cls} style={uploaderStyle} onClick={this.onClick} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={this.onDrop}>
            <span>+</span>
            <input style={{ display: 'none' }} type="file" multiple={multiple} accept={accept} ref="fileInput" onChange={this.onDrop} />
          </div>
        </If>
      </div>
    );
  }

}
