import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { fetchNinepic, saveNinepic, resetNinepic } from 'redux/modules/ninePic/ninepic';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/ninePic/ninepicFilters';
import { Uploader } from 'components/Uploader';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';


const actionCreators = {
  fetchFilters,
  fetchNinepic,
  saveNinepic,
  resetNinepic,
  fetchUptoken,
};

@connect(
  state => ({
    ninepic: state.ninepic,
    filters: state.ninepicFilters,
    uptoken: state.uptoken,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

class EditNinepic extends Component {
  static propTypes = {
    prefixCls: React.PropTypes.string,
    children: React.PropTypes.any,
    filters: React.PropTypes.object,
    location: React.PropTypes.any,
    fetchNinepic: React.PropTypes.func,
    saveNinepic: React.PropTypes.func,
    resetNinepic: React.PropTypes.func,
    ninepic: React.PropTypes.object,
    form: React.PropTypes.object,
    fetchUptoken: React.PropTypes.func,
    uptoken: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  static defaultProps = {
    prefixCls: 'ninepic-edit',
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {
    ninepics: [],
    modalVisible: false,
  }

  componentWillMount() {
    const { filters } = this.props;
    const { id } = this.props.location.query;
    this.props.fetchUptoken();
    if (id) {
      this.props.fetchNinepic(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ninepic } = nextProps;
    console.log('will moment');
    if (ninepic && !ninepic.isLoading && ninepic.success && ninepic.updated) {
      this.context.router.goBack();
    }
    if (ninepic.success) {
      const detailPics = [];
      if (!isEmpty(ninepic.picArry)) {
        each(ninepic.picArry, (img) => {
          detailPics.push({
            uid: img,
            url: img,
            status: 'done',
          });
        });
      }
      this.props.form.setFieldsInitialValue({
        id: ninepic.id,
        title: ninepic.title,
        advertisementType: ninepic.advertisementType,
        advertisementTypeDisplay: ninepic.advertisementTypeDisplay,
        description: ninepic.description,
        saleCategory: ninepic.saleCategory,
        categoryName: ninepic.categoryName,
        detailModelids: ninepic.detailModelids,
        memo: ninepic.memo,
        fileList: detailPics,
        redirectUrl: ninepic.redirectUrl,
        startTime: moment(ninepic.startTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
      console.log(123);
      this.props.form.setFieldsInitialValue({
        fileList: [],
        startTime: moment(ninepic.startTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    }
  }

  componentWillUnmount() {
    this.props.resetNinepic();
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
    this.props.saveNinepic(this.props.ninepic.id, {
      title: params.title,
      description: params.description,
      saleCategory: params.saleCategory,
      startTime: moment(params.startTime).format('YYYY-MM-DD HH:mm:ss'),
      sortOrder: params.sortOrder,
      detailModelids: params.detailModelids,
      redirectUrl: params.redirectUrl,
      picArry: detailPics,
      memo: params.memo,
    });
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
    wrapperCol: { span: 9 },
  })

  render() {
    const { prefixCls, ninepic, form, filters, uptoken } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { ninepics } = this.state;
    let multiple = true;
    return (
      <div>
        <Form horizontal className={`${prefixCls}`}>
          <Form.Item {...this.formItemLayout()} label="标题">
            <Input {...getFieldProps('title', { rules: [{ required: true, title: '标题' }] })} value={getFieldValue('title')} placeholder="标题" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="开始时间">
            <DatePicker {...getFieldProps('startTime', { rules: [{ required: true, title: '开始时间' }] })} value={getFieldValue('startTime')} format="yyyy-MM-dd HH:mm:ss" showTime required />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类别">
            <Select {...getFieldProps('saleCategory')} value={getFieldValue('saleCategory')} placeholder="推送的产品类别!">
              {filters.categorys.map((item) => (<Select.Option value={item[0]}>{item[1]}</Select.Option>))}
            </Select>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="描述">
            <Input {...getFieldProps('description')} value={getFieldValue('description')} placeholder="推送描述内容" type="textarea" rows={7} />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="推广图片" required>
            <Uploader
              uptoken={uptoken.token}
              fileList={getFieldValue('fileList')}
              multiple={multiple}
              onRemove={this.onPicRemove}
              onChange={this.onPicChange}
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="款式id">
            <Input {...getFieldProps('detailModelids')} value={getFieldValue('detailModelids')} placeholder="填写款式id, 多个用逗号隔开" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="跳转页面">
            <Input {...getFieldProps('redirectUrl')} value={getFieldValue('redirectUrl')} placeholder="跳转页面后缀" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="备注">
            <Input {...getFieldProps('memo')} value={getFieldValue('memo')} placeholder="后台备注" type="textarea" rows={7} />
          </Form.Item>
          <Row>
            <Col span={2} offset={6}><Button type="primary" onClick={this.onSubmitClick}>保存</Button></Col>
          </Row>
        </Form>
      </div>
    );
  }
}

export const Edit = Form.create()(EditNinepic);
