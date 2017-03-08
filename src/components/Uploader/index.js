import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { If } from 'jsx-control-statements';
import { Upload, Icon, message, Modal } from 'antd';
import { uploadUrl } from 'constants';
import { each } from 'lodash';

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
    onPreview: React.PropTypes.func,
    onRemove: React.PropTypes.func,
    onChange: React.PropTypes.func,
    showDownloadBtn: React.PropTypes.func,
  };

  static defaultProps = {
    prefixs: 'upload',
    size: 100,
    text: '上传图片',
    accept: 'image/*',
    multiple: false,
    showDownloadBtn: false,
  }

  state = {
    previewVisible: false,
    previewImage: '',
  }

  onClickDownloadBtn = (e) => {
    const { fileList } = this.props;
    each(fileList, (file) => {
      const tempLink = document.createElement('a');
      tempLink.href = file.url;
      tempLink.setAttribute('download', file.url);
      tempLink.setAttribute('target', '_blank');
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
    });
  }

  data = (file) => {
    const { prefixs, uptoken } = this.props;
    const timeStamp = new Date().getTime();
    return {
      key: `img_${timeStamp}.${file.name.split('.').pop()}`,
      // key: `nine_pic${timeStamp}`,
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

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleCancel = () => this.setState({ previewVisible: false })

  render() {
    const { uptoken, size, text, multiple, accept, fileList, onRemove, onChange, onPreview, showDownloadBtn } = this.props;
    const { previewVisible, previewImage } = this.state;
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
          onPreview={onPreview || this.handlePreview}
          onRemove={onRemove}
          onChange={onChange}
          headers={headers}
          beforeUpload={this.beforeUpload}
          data={this.data}>
          <Icon type="plus" />
          <div className="ant-upload-text">{text}</div>
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <If condition={showDownloadBtn}>
          <div style={{ height: size }}><a className="btn" onClick={this.onClickDownloadBtn}>下载全部图片</a></div>
        </If>
      </div>
    );
  }

}
