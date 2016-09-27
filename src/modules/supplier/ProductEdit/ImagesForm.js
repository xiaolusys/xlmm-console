import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Row, Select, Table } from 'antd';
import { Uploader } from 'components/Uploader';

class Images extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    product: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    updateProduct: React.PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props);
    context.router;
  }

  state = {

  }

  componentWillMount() {

  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { product, uptoken } = this.props;
    const { getFieldProps, getFieldValue } = this.props.form;
    return (
      <Form>
        <Form.Item {...this.formItemLayout()} label="商品主图" required>
          <Uploader
            uptoken={uptoken.token}
            fileList={getFieldValue('mainPics')}
            onRemove={this.onMainPicsRemove}
            onChange={this.onMainPicsChange}
            />
        </Form.Item>
        <Form.Item {...this.formItemLayout()} label="详情" required>
          <Uploader
            uptoken={uptoken.token}
            fileList={getFieldValue('detailPics')}
            onRemove={this.onMainPicsRemove}
            onChange={this.onMainPicsChange}
            />
        </Form.Item>
      </Form>
    );
  }
}

export const ImagesForm = Form.create()(Images);
