import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Select, Tag, Button, DatePicker, Form, Switch, Icon, Input, message, Popover, Card, Alert, Tabs } from 'antd';
import Modals from 'modules/Modals';
import { imageUrlPrefixs } from 'constants';
import { fetchNinepic, saveNinepic, resetNinepic } from 'redux/modules/ninePic/ninepic';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import moment from 'moment';
import { fetchFilters } from 'redux/modules/ninePic/ninepicFilters';
import { fetchPromotionPros } from 'redux/modules/ninePic/ninepicPromotionPros';
import { Uploader } from 'components/Uploader';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';
const TabPane = Tabs.TabPane;


const actionCreators = {
  fetchFilters,
  fetchNinepic,
  saveNinepic,
  resetNinepic,
  fetchUptoken,
  fetchPromotionPros,
};

@connect(
  state => ({
    ninepic: state.ninepic,
    filters: state.ninepicFilters,
    uptoken: state.uptoken,
    promotionPros: state.promotionPros,
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
    fetchPromotionPros: React.PropTypes.func,
    uptoken: React.PropTypes.object,
    promotionPros: React.PropTypes.any,
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
    const now = new Date();
    const todayDateArry = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
    const todayDate = todayDateArry.join('-');
    this.props.fetchUptoken();
    this.props.fetchPromotionPros(todayDate);
    if (id) {
      this.props.fetchNinepic(id);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { ninepic, promotionPros } = nextProps;
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
        isPushed: ninepic.isPushed,
        historyDescriptions: ninepic.historyDescriptions,
        startTime: moment(ninepic.startTime).format('YYYY-MM-DD HH:mm:ss'),
      });
    } else {
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
      isPushed: params.isPushed,
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
        console.log('debug file : ', file);
        file.url = `${imageUrlPrefixs}${file.response.key}`;
        message.success(`上传成功: ${file.name}`);
      } else if (file.status === 'error') {
        message.error(`上传失败: ${file.name}`);
      }
    });
    this.props.form.setFieldsValue({ fileList: fileList });
  }

  onPromotionDateChange = (date, dateString) => {
    const self = this;
    this.props.fetchPromotionPros(dateString);
  }

  formItemLayout = () => ({
    labelCol: { span: 3 },
    wrapperCol: { span: 18 },
  })

  chooseProduct = (e) => {
    const { modelid } = e.currentTarget.dataset;
    const oldModelIds = this.props.form.getFieldProps('detailModelids').value;
    let tmp = '';
    if (typeof(oldModelIds) === 'undefined') {
      tmp = [];
    } else {
      tmp = oldModelIds.split(',');
    }
    let isIn = false;
    for (let i = 0; i < tmp.length; i++) {
      if (modelid === tmp[i]) {
        isIn = true;
      }
    }
    if (isIn === false) {
      tmp.push(modelid);
    } else {
      message.error('已经添加了！');
    }
    const tmp2 = [];
    for (let j = 0; j < tmp.length; j++) {
        if (tmp[j] !== '') {
          tmp2.push(tmp[j]);
        }
    }
    const mds = tmp2.join(',');
    this.props.form.setFieldsValue({ detailModelids: mds });
  }

  promotionProHistoryDescriptionsPopContent = (promotionPro) => {
    const self = this;
    if (promotionPro && promotionPro.historyDescriptions !== []) {
      return (
        <div>
          {promotionPro.historyDescriptions.map((item) => (<p><a data-historydescription={item.description} onClick={self.chooseDescription}>ID:{item.id}=> 保存{item.saveTimes}次 ＆ 分享{item.shareTimes}次,{item.description}</a></p>))};
        </div>
      );
    }
    return (<div><p>没有历史推送...</p></div>);
  }
  proCard = (promotionPro) => {
    const self = this;
    const { modelId } = promotionPro;
    return (
      <Col span={6}>
        <Card style={{ width: 140 }} bodyStyle={{ padding: 0 }}>
          <div className="custom-image">
            <a target="_blank" href={`http://m.xiaolumeimei.com/mall/product/details/${promotionPro.modelId}`} >
              <img alt="" width="100%" src={promotionPro.picPath} />
            </a>
          </div>
          <div className="custom-card">
            <h3>{promotionPro.saleTime}</h3>
            <span>{promotionPro.name.slice(0, 20)}</span>
            <div>
              <Button data-modelid={modelId} onClick={self.chooseProduct} size="small" type="primary">加入款式id</Button>
              <Popover placement="right" title="历史推送内容(点击替换当前描述)" content={this.promotionProHistoryDescriptionsPopContent(promotionPro)} trigger="click">
                <Button size="small" type="primary">历史推送内容</Button>
              </Popover>
            </div>
          </div>
        </Card>
      </Col>
    );
  }

  categoryPromotionPors = (categoryPromotionPor) => {
    const self = this;
    return (
      <div>
        {categoryPromotionPor.values.map((item) => (<span>{this.proCard(item)}</span>))}
      </div>
    );
  }

  promotionProducts = (promotionPros) => {
    const self = this;
    console.log('debug promotionPros:', promotionPros);
    return (
      <div>
        <Row>
          <Tabs defaultActiveKey="1" >
            {promotionPros.map((item) => (<TabPane tab={item.name} key={item.name}>{this.categoryPromotionPors(item)}</TabPane>))}
          </Tabs>
        </Row>
      </div>);
  }

  chooseDescription = (e) => {
    const self = this;
    const { historydescription } = e.currentTarget.dataset;
    this.props.form.setFieldsValue({ description: historydescription });
  }

  historyDescriptionsPopContent = () => {
    const self = this;
    const { ninepic } = this.props;
    if (ninepic && ninepic.success) {
      return (
        <div>
          {ninepic.historyDescriptions.map((item) => (<p>
            <a data-historydescription={item.description} onClick={self.chooseDescription}>ID:{item.id}=> 保存{item.saveTimes}次 ＆ 分享{item.shareTimes}次 {item.description}</a></p>))};
        </div>
      );
    }
    return (<div><p>没有历史推送...</p></div>);
  }

  render() {
    const { prefixCls, ninepic, form, filters, uptoken, promotionPros } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    const { ninepics } = this.state;
    let multiple = true;
    return (
      <div>
        <Row>
          <Col span={10}>
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
              <Form.Item {...this.formItemLayout()} label="执行推送">
                <Select {...getFieldProps('isPushed')} value={getFieldValue('isPushed')} placeholder="执行推送!">
                  {filters.isPushed.map((item) => (<Select.Option value={item.value}>{item.name}</Select.Option>))}
                </Select>
                <Alert message="选择稍后推送后系统将自动检查推送app消息给用户，推送内容为标题填写的内容" type="info" showIcon />
              </Form.Item>
              <Form.Item {...this.formItemLayout()} label="描述">
                <Popover placement="right" title="历史推送内容(点击替换当前描述.)" content={this.historyDescriptionsPopContent()} trigger="click">
                  <Input {...getFieldProps('description')} value={getFieldValue('description')} placeholder="推送描述内容" type="textarea" rows={7} />
                </Popover>
              </Form.Item>
              <Form.Item {...this.formItemLayout()} style={{ height: 270 }} label="推广图片" required>
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
          </Col>
          <Col span={14}>
            <DatePicker onChange={this.onPromotionDateChange} />
            {this.promotionProducts(promotionPros.items)}
          </Col>
        </Row>
      </div>
    );
  }
}

export const Edit = Form.create()(EditNinepic);
