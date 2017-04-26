import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Col, DatePicker, Input, Form, Row, Select, Table, Popconfirm, Search, Icon, message } from 'antd';
import { assign, noop, map, each, isEmpty } from 'lodash';
import moment from 'moment';
import { imageUrlPrefixs } from 'constants';
import stringcase from 'stringcase';
import { updateAppBanner, resetAppBanner, fetchAppBanner } from 'redux/modules/appBanner/appBanner';
import { Uploader } from 'components/Uploader';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';

const actionCreators = {
  updateAppBanner,
  fetchUptoken,
  resetAppBanner,
  fetchAppBanner,
};

@connect(
  state => ({
    appBanner: state.appBanner,
    uptoken: state.uptoken,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
  )

class EditBannerPic extends Component {
  static propTypes = {
    form: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    appBanner: React.PropTypes.object,
    updateAppBanner: React.PropTypes.func,
    resetAppBanner: React.PropTypes.func,
    fetchUptoken: React.PropTypes.func,
    location: React.PropTypes.object,
    fetchAppBanner: React.PropTypes.func,
  }
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props, context) {
    super(props);
    context.router;
  }
  componentWillMount() {
    this.props.fetchUptoken();
    const id = this.props.location.query.id;
    this.props.fetchAppBanner(id);
  }
  componentWillReceiveProps(nextProps) {
    const picList = [];
    this.props.form.setFieldsInitialValue({
      fileList: picList,
  });
    const { updated } = nextProps.appBanner;
    if (updated) {
      message.success('创建成功');
      this.context.router.goBack();
    }

  }
  componentWillUnmount() {
    this.props.resetAppBanner();
  }
  onSubmitClick = (e) => {
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
    });
    const params = this.props.form.getFieldsValue();
    const detailPics = [];
      if (!isEmpty(params.fileList)) {
        each(params.fileList, (picInstance) => {
          detailPics.push(picInstance.url);
        });
      }
    const id = this.props.location.query.id;
    const picId = this.props.location.query.picId;
    const item = this.props.appBanner.item;
    item[picId].picLink = detailPics[0];
    const items = { items: item };
    this.props.updateAppBanner(id, items);
  }
  onPicRemove = (file) => {
    const fileList = [];
    each(this.props.form.getFieldValue('fileList'), (item) => {
      if (file.url !== item.url) {
        fileList.push(item);
      }
    });
    this.props.form.setFieldsValue({ fileList: fileList });
  }
  onPicChange = ({ fileList }) => {
    each(fileList, (file) => {
      if (file.status === 'done' && file.response) {
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ fileList: fileList });
  }
  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 14 },
  })
  render() {
    const self = this;
    const uptoken = this.props.uptoken;
    const { getFieldProps, getFieldValue, setFieldsValue, getFieldsValue } = this.props.form;
    return (
      <div>
        <Form.Item {...this.formItemLayout()} label="图片" required>
          <Uploader
            {...getFieldProps('fileList')}
            uptoken={uptoken.token}
            multiple="true"
            fileList={getFieldValue('fileList')}
            onRemove={this.onRemove}
            onChange={this.onPicChange}
            />
        </Form.Item>
        <Row>
          <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
        </Row>
      </div>
      );
  }
}

export const EditAppBannerPic = Form.create()(EditBannerPic);
