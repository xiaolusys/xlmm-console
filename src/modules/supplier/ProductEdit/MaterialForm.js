import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Form, Input, Row, Select } from 'antd';

class Material extends Component {

  constructor(props, context) {
    super(props);
    context.router;
  }

  render() {
    return (
      <Form>
        <div>完善资料</div>
      </Form>
    );
  }
}


export const MaterialForm = Form.create()(Material);
