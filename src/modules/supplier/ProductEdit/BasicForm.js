import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Card, Col, Form, Input, Cascader, Popover, Row, TreeSelect, Select, Tag, Table, message } from 'antd';
import { If } from 'jsx-control-statements';
import { fetchSku, addSku } from 'redux/modules/supplyChain/sku';
import { saveProduct, updateProduct } from 'redux/modules/supplyChain/product';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, map, merge, sortBy, toArray, union, unionBy, uniqBy } from 'lodash';
import { Uploader } from 'components/Uploader';
import { replaceAllKeys } from 'utils/object';
import { imageUrlPrefixs } from 'constants';

const actionCreators = {
  fetchSku,
  addSku,
  saveProduct,
  updateProduct,
};

@connect(
  state => ({
    sku: state.sku,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)
class Basic extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    product: React.PropTypes.object,
    categories: React.PropTypes.object,
    supplier: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    sku: React.PropTypes.array,
    fetchSku: React.PropTypes.func,
    addSku: React.PropTypes.func,
    saveProduct: React.PropTypes.func,
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
    skus: {},
    skuItems: [],
  }

  componentWillReceiveProps(nextProps) {
    const { product, sku } = nextProps;
    if (product.success) {
      this.props.form.setFieldsInitialValue({
        fileList: [{
          uid: product.picUrl,
          url: product.picUrl,
          status: 'done',
        }],
        productLink: product.productLink,
        title: product.title,
        supplierSku: product.supplierSku,
      });
    }
    if (product.success && sku.success && isEmpty(this.state.skus)) {
      const selected = this.findSkuValues(product, sku);
      this.props.form.setFieldsInitialValue({
        saleCategory: product.saleCategory ? [product.saleCategory.parentCid, product.saleCategory.cid] : [],
        fileList: [{
          uid: product.picUrl,
          url: product.picUrl,
          status: 'done',
        }],
        skuItems: this.findSkuItems(product, sku),
        ...selected,
      });
      this.setState({
        skus: selected,
        skuItems: product.skuExtras,
      });
    }
  }

  onCategoryChange = (values) => {
    let catgoryId = values[values.length - 1].split('-');
    catgoryId = catgoryId[catgoryId.length - 1];
    this.props.fetchSku(catgoryId);
    this.props.form.setFieldsValue({ saleCategory: values });
  }

  onSkuItemsChange = (values) => {
    if (includes(values, 0)) {
      this.setState({ skuItems: this.generateSkuTable() });
      this.props.form.setFieldsValue({ skuItems: 0 });
      return;
    }
    this.setState({ skuItems: [] });
    this.props.form.setFieldsValue({ skuItems: values });
  }

  onSkusChange = (values, label, extra) => {
    let id = -1;
    if (isEmpty(values)) {
      id = JSON.parse(extra.preValue[0].value).id;
    }
    if (!isEmpty(values)) {
      id = JSON.parse(values[0]).id;
    }
    const { product } = this.props;
    const { skus } = this.state;
    this.props.form.setFieldsValue({
      [`skus-${id}`]: values,
    });
    skus[`skus-${id}`] = values;
    this.setState({
      skus: skus,
      skuItems: this.generateSkuTable(skus),
    });
  }

  onInput = (e) => {
    const { value } = e.target;
    const sku = JSON.parse(e.target.dataset.sku);
    const { type } = e.target.dataset;
    const { skuItems } = this.state;
    each(skuItems, (item) => {
      if (`${item.color}-${item.propertiesName}` === `${sku.color}-${sku.propertiesName}`) {
        item[type] = value;
      }
    });
    this.setState({ skuItems: skuItems });
  }

  onbatchValueInput = (e) => {
    const { type } = e.target.dataset;
    const { value } = e.target;
    this.setState({
      [type]: value,
    });
  }

  onBatchSettingClick = (e) => {
    const { type } = e.currentTarget.dataset;
    const { skuItems } = this.state;
    const value = this.state[type];
    each(skuItems, (item) => {
      item[type] = value;
    });
    this.setState({ skuItems: skuItems });
  }

  onRemove = (file) => {
    const fileList = [];
    each(this.props.form.getFieldValue('fileList'), (item) => {
      if (file.url !== item.url) {
        fileList.push(item);
      }
    });
    this.props.form.setFieldsValue({ fileList: fileList });
  }

  onChange = ({ fileList }) => {
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

  onSaveClick = (e) => {
    const { productId, supplierId } = this.props.location.query;
    const { getFieldValue } = this.props.form;
    if (getFieldValue('fileList').length !== 1) {
      message.warning('上传一张图片!');
      return;
    }
    const params = {
      title: getFieldValue('title'),
      productLink: getFieldValue('productLink'),
      picUrl: getFieldValue('fileList')[0].url,
      saleCategory: this.getCategory(getFieldValue('saleCategory')),
      saleSupplier: supplierId,
      supplierSku: getFieldValue('supplierSku'),
      skuExtras: this.state.skuItems,
    };
    if (productId) {
      this.props.updateProduct(productId, params);
      return;
    }
    this.props.saveProduct(params);
  }

  onCancelClick = (e) => {
    this.context.router.goBack();
  }

  onSkuValueInput = (e) => {
    const { dataset, value } = e.target;
    this.setState({
      [`sku-value-${dataset.id}`]: value,
    });
  }

  onAddSkuValueClick = (e) => {
    const { id, name } = e.currentTarget.dataset;
    const value = this.state[`sku-value-${id}`];
    const { skus } = this.state;
    const skuValue = this.generateSkuValue(id, name, value);
    const values = union(skus[`skus-${id}`], [skuValue.value]);
    this.props.addSku(id, skuValue);
    this.props.form.setFieldsValue({
      [`skus-${id}`]: values,
    });
    skus[`skus-${id}`] = values;
    this.setState({
      skus: skus,
      skuItems: this.generateSkuTable(skus),
    });
  }

  getCategory = (catgoryIds) => (catgoryIds[1].split('-')[1])

  getSkuByName = (sku, key) => {
    let value;
    sku = JSON.parse(sku);
    if (sku.name.indexOf(key) >= 0) {
      value = sku.value;
    }
    return value;
  }

  findSkuItems = (product, sku) => {
    const skuItems = [];
    const firstSku = product.skuExtras[0];
    each(sku.items.toJS(), (item) => {
      if (firstSku.color === item.name && item.name === '统一规格') {
        skuItems.push(item.id);
      }
      if (firstSku.color && item.name !== '统一规格') {
        skuItems.push(item.id);
      }
      if (firstSku.propertiesName && item.name === '尺码') {
        skuItems.push(item.id);
      }
    });
    return skuItems;
  }

  findSkuValues = (product, sku) => {
    const colors = [];
    const sizes = [];
    const selected = {};
    let colorId = 0;
    let sizeId = 0;
    each(sku.items.toJS(), (item) => {
      if (item.name === '尺码') {
        sizeId = item.id;
      }
      if (item.name === '颜色') {
        colorId = item.id;
      }
    });

    map(groupBy(product.skuExtras, 'color'), (item, key) => {
      colors.push(JSON.stringify({
        id: colorId,
        name: '颜色',
        value: key,
      }));
    });

    map(groupBy(product.skuExtras, 'propertiesName'), (item, key) => {
      sizes.push(JSON.stringify({
        id: sizeId,
        name: '尺码',
        value: key,
      }));
    });

    if (!isEmpty(colors)) {
      selected[`skus-${colorId}`] = colors;
    }

    if (!isEmpty(sizes)) {
      selected[`skus-${sizeId}`] = sizes;
    }
    return selected;
  }

  generateSkuValue = (id, name, value) => ({
    label: value,
    key: value,
    value: JSON.stringify({
      id: id,
      name: name,
      value: value,
    }),
  })

  generateSkuTable = (skus) => {
    if (isEmpty(skus)) {
      return [{
        color: '统一规格',
        remainNum: 0,
        cost: 0,
        stdSalePrice: 0,
        agentPrice: 0,
        propertiesName: '',
        propertiesAlias: '',
      }];
    }
    skus = toArray(skus);
    const skuItems = [];
    if (skus.length === 1) {
      each(skus[0], sku => {
        const color = this.getSkuByName(sku, '颜色') || '';
        const size = this.getSkuByName(sku, '尺码') || '';
        skuItems.push({
          color: color,
          remainNum: 0,
          cost: 0,
          stdSalePrice: 0,
          agentPrice: 0,
          propertiesName: size,
          propertiesAlias: size,
        });
      });
    }
    if (skus.length === 2) {
      each(skus[0], skuA => {
        each(skus[1], skuB => {
          const color = this.getSkuByName(skuA, '颜色') || this.getSkuByName(skuB, '颜色') || '';
          const size = this.getSkuByName(skuA, '尺码') || this.getSkuByName(skuB, '尺码') || '';
          skuItems.push({
            color: color,
            remainNum: 0,
            cost: 0,
            stdSalePrice: 0,
            agentPrice: 0,
            propertiesName: size,
            propertiesAlias: size,
          });
        });
      });
    }
    return sortBy(skuItems, 'color');
  }

  columnTitle = (text, type) => {
    const content = (
      <div className="clearfix">
        <Input type="text" data-type={type} onInput={this.onbatchValueInput} />
        <Button style={{ marginTop: 10 }} type="primary pull-right" data-type={type} onClick={this.onBatchSettingClick}>确定</Button>
      </div>
    );
    return (
      <Popover trigger="click" placement="top" content={content} title={`批量设置${text}`}>
        <span>{text} <a>批量</a></span>
      </Popover>
    );
  }

  skuInput = (id, name) => {
    const content = (
      <div className="clearfix">
        <Input type="text" data-id={id} value={this.state[`sku-value-${id}`]} onInput={this.onSkuValueInput} />
        <Button style={{ marginTop: 10 }} type="primary pull-right" data-id={id} data-name={name} onClick={this.onAddSkuValueClick}>确定</Button>
      </div>
    );
    return (
      <Popover trigger="click" placement="bottom" content={content} title={`添加${name}`}>
        <Button style={{ marginTop: 8 }} size="small">{`添加${name}`}</Button>
      </Popover>
    );
  }

  tableProps = () => {
    const self = this;
    return {
      columns: [{
        title: '规格',
        key: 'sku',
        render: (record) => (
          <span>
            <If condition={record.color}>
              <Tag color="blue">{record.color}</Tag>
            </If>
            <If condition={record.propertiesName}>
              <Tag color="green">{record.propertiesName}</Tag>
            </If>
          </span>
        ),
      }, {
        title: this.columnTitle('预留数', 'remainNum'),
        dataIndex: 'remainNum',
        key: 'remainNum',
        render: (data, record) => <Input type="text" data-type="remainNum" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      }, {
        title: this.columnTitle('采购价', 'cost'),
        dataIndex: 'cost',
        key: 'cost',
        render: (data, record) => <Input type="text" data-type="cost" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      }, {
        title: this.columnTitle('售价', 'agentPrice'),
        dataIndex: 'agentPrice',
        key: 'agentPrice',
        render: (data, record) => <Input type="text" data-type="agentPrice" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      }, {
        title: this.columnTitle('吊牌价', 'stdSalePrice'),
        key: 'stdSalePrice',
        dataIndex: 'stdSalePrice',
        render: (data, record) => <Input type="text" data-type="stdSalePrice" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      }],
      pagination: false,
    };
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 5 },
  })

  render() {
    const { product, categories, supplier, sku, uptoken } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
    let options = replaceAllKeys(categories.items, 'name', 'label');
    options = replaceAllKeys(options, 'cid', 'value');
    return (
      <div>
        <Form horizontal>
          <Form.Item {...this.formItemLayout()} label="供应商">
            <p>{supplier.supplierName}</p>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="商品名称">
            <Input
              {...getFieldProps('title', { rules: [{ required: true, message: '请输入商品名称！' }] })}
              value={getFieldValue('title')}
              placeholder="请输入商品名称"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="商品链接">
            <Input
              {...getFieldProps('productLink', { rules: [{ required: true, message: '请输入商品链接！' }] })}
              value={getFieldValue('productLink')}
              placeholder="请输入商品链接"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="货号">
            <Input
              {...getFieldProps('supplierSku')}
              value={getFieldValue('supplierSku')}
              placeholder="请输入货号"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="商品主图" required>
            <Uploader
              uptoken={uptoken.token}
              fileList={getFieldValue('fileList')}
              onRemove={this.onRemove}
              onChange={this.onChange}
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类目" required>
            <Cascader
              options={options}
              onChange={this.onCategoryChange}
              value={getFieldValue('saleCategory')}
              placeholder="请选择类目"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="规格" required>
            <Select
              onChange={this.onSkuItemsChange}
              value={getFieldValue('skuItems')}
              multiple>
              {sku.items.toJS().map((item) => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          {sku.items.toJS().map((skuItem) => {
            if (skuItem.id !== 0 && includes(getFieldValue('skuItems'), skuItem.id)) {
              return (
                <Form.Item {...this.formItemLayout()} label={skuItem.name} required>
                  <TreeSelect
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    treeData={skuItem.values}
                    placeholder={`请选择${skuItem.name}`}
                    onChange={this.onSkusChange}
                    value={getFieldValue(`skus-${skuItem.id}`)}
                    treeCheckable
                    multiple
                    allowClear
                    showSearch
                    />
                {this.skuInput(skuItem.id, skuItem.name)}
                </Form.Item>
              );
            }
            return null;
          })}
          <If condition={!isEmpty(this.state.skuItems)}>
            <Row>
              <Col offset="1" span="12">
                <Table {...this.tableProps()} dataSource={this.state.skuItems} />
              </Col>
            </Row>
          </If>
        </Form>
        <Row style={{ marginTop: 10 }}>
          <Col offset="11" span="1">
            <Button onClick={this.onCancelClick}>取消</Button>
          </Col>
          <Col span="1">
            <Button type="primary" onClick={this.onSaveClick} loading={product.isLoading}>保存</Button>
          </Col>
        </Row>
      </div>
    );
  }

}

export const BasicForm = Form.create()(Basic);
