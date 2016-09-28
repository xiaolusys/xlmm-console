import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Upload, Icon, message } from 'antd';
import { uploadUrl } from 'constants';

import './index.less';


export class Uploader extends Component {

  static propTypes = {
    prefixs: React.PropTypes.string,
    uptoken: React.PropTypes.string,
    size: React.PropTypes.any,
    text: React.PropTypes.string,
    multiple: React.PropTypes.boolean,
    accept: React.PropTypes.string,
    fileList: React.PropTypes.array,
    onRemove: React.PropTypes.func,
    onChange: React.PropTypes.func,
  };

  static defaultProps = {
    prefixs: 'upload',
    size: 100,
    text: '上传图片',
    accept: 'image/*',
    multiple: false,
  }

  data = (file) => {
    const { prefixs, uptoken } = this.props;
    return {
      key: `${prefixs}/${this.uuid()}.${file.name.split('.').pop()}`,
      token: uptoken,
    };
  }

  uuid = () => {
    let uuid = '';
    for (let i = 0; i < 32; i++) {
      const random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16); // eslint-disable-line
    }
    return uuid;
  }

  render() {
    const { uptoken, size, text, multiple, accept, fileList, onRemove, onChange } = this.props;
    const headers = {
      Accept: 'application/json',
    };
    return (
      <div className="uploader clearfix" style={{ height: size }}>
        <Upload
          action={uploadUrl}
          fileList={fileList}
          listType="picture-card"
          multiple={multiple}
          accept={accept}
          onRemove={onRemove}
          onChange={onChange}
          headers={headers}
          beforeUpload={this.beforeUpload}
          data={this.data}>
          <Icon type="plus" />
          <div className="ant-upload-text">{text}</div>
        </Upload>
      </div>
    );
  }

}
