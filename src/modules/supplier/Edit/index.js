import React, { Component } from 'react';
import { Button, Col, Input, Form, FormItem, Row, Select, Table } from 'antd';


class EditWithForm extends Component {

  static propTypes = {

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
    wrapperCol: { span: 4 },
  })

  render() {
    return (
      <div>
        <Form horizontal>
          <Form.Item {...this.formItemLayout()} label="公司名称" required>
            <Input placeholder="请输入公司名称" id="company" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="品牌名称" required>
            <Input placeholder="请输入品牌名称" id="brand" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="品牌主页" required>
            <Input placeholder="请输入品牌主页" id="homePage" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="产品特长">
            <Input placeholder="请输入产品特长" id="homePage" />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="备注">
            <Input placeholder="备注" id="homePage" />
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export const Edit = Form.create()(EditWithForm);
