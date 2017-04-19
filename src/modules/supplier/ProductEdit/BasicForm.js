import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Button, Card, Checkbox, Col, Form, Input, Cascader, Popover, Radio, Row, TreeSelect, Select, Tag, Table, message } from 'antd';
import { If } from 'jsx-control-statements';
import { fetchSku, addSku, batchAddSku } from 'redux/modules/supplyChain/sku';
import { saveProduct, updateProduct } from 'redux/modules/supplyChain/product';
import { fetchPreference } from 'redux/modules/supplyChain/preference';
import { difference, each, groupBy, includes, isEmpty, isArray, isMatch, last, map, assign, merge, sortBy, toInteger, toArray, union, unionBy, uniqBy } from 'lodash';
import { Uploader } from 'components/Uploader';
import { replaceAllKeys, toErrorMsg } from 'utils/object';
import { imageUrlPrefixs, productTypes, sourceTypes, boutiqueSkuTpl } from 'constants';
import changeCaseKeys from 'change-case-keys';

const actionCreators = {
  fetchSku,
  addSku,
  batchAddSku,
  saveProduct,
  updateProduct,
  fetchPreference,
};

@connect(
  state => ({
    sku: state.sku,
    stockProduct: state.stockProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
class Basic extends Component {

  static propTypes = {
    form: React.PropTypes.object,
    location: React.PropTypes.object,
    product: React.PropTypes.object,
    categories: React.PropTypes.object,
    supplier: React.PropTypes.object,
    uptoken: React.PropTypes.object,
    sku: React.PropTypes.array,
    preference: React.PropTypes.object,
    fetchSku: React.PropTypes.func,
    addSku: React.PropTypes.func,
    batchAddSku: React.PropTypes.func,
    saveProduct: React.PropTypes.func,
    updateProduct: React.PropTypes.func,
    fetchPreference: React.PropTypes.func,
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
    isBoutique: false,
    productType: '0',
    sourceType: '0',
    firstLoadUpdate: false,
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { product, sku } = nextProps;
    if (product.updated) {
      this.context.router.goBack();
      return;
    }
    if (product.success && (sku.success || !product.id) && !this.state.firstLoadUpdate) {
      const selected = this.findAndUnionSkuValues(product.skuExtras, sku);
      const skuItems = this.findSkuItems(product.skuExtras, sku);
      const categoryComb = [];
      const picList = [];
      if (product.saleCategory) {
        each(product.saleCategory.cid.split('-'), (c) => {
          categoryComb.push(categoryComb.length > 0 ? `${categoryComb[categoryComb.length - 1]}-${c}` : c);
        });
      }
      if (product.picUrl) {
        picList.push({
          uid: product.picUrl,
          url: product.picUrl,
          name: product.picUrl,
          status: 'done',
        });
      }
      this.props.form.setFieldsInitialValue({
        fileList: picList,
        productLink: product.productLink,
        title: product.title,
        supplierSku: product.supplierSku,
        memo: product.memo,
        saleCategory: categoryComb,
        skuItems: skuItems,
        ...selected,
      });
      assign(this.state, {
        skus: selected,
        skuItems: product.skuExtras || [],
        firstLoadUpdate: true,
        isBoutique: product.extras && product.extras.isBoutique || false,
        productType: product.extras && product.extras.productType || '0',
        sourceType: product.sourceType && product.sourceType.toString() || '0',
      });
    }
    if (product.failure) {
      message.error(`请求错误: ${toErrorMsg(product.error) || ''}`);
    }
    if (sku.failure) {
      message.error(`请求错误: ${toErrorMsg(sku.error) || ''}`);
    }
  }

  onCategoryChange = (values) => {
    let catgoryId = values[values.length - 1].split('-');
    catgoryId = catgoryId[catgoryId.length - 1];
    this.props.fetchSku(catgoryId);
    this.props.form.setFieldsValue({ saleCategory: values });
  }

  onSkuItemsChange = (values) => {
    if (isEmpty(values)) {
      this.setState({ skuItems: [], skus: {} });
      this.props.form.setFieldsValue({ skuItems: [] });
      return;
    }
    if (includes(values, 0)) {
      this.setState({ skuItems: this.generateSkuTable([]) });
      this.props.form.setFieldsValue({ skuItems: [0] });
      return;
    }
    const skuTable = this.generateSkuTable(values);
    this.setState({ skuItems: skuTable });
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
    const { skuItems } = this.state;
    const categories = getFieldValue('saleCategory');
    if (!getFieldValue('fileList') || getFieldValue('fileList').length !== 1) {
      message.warning('请上传一张图片!');
      return;
    }
    if (isEmpty(categories)) {
      message.warning('请选择类目!');
      return;
    }
    const params = {
      title: getFieldValue('title'),
      productLink: getFieldValue('productLink'),
      picUrl: getFieldValue('fileList')[0].url,
      saleCategory: this.getCategory(categories),
      saleSupplier: supplierId,
      sourceType: this.state.sourceType,
      supplierSku: getFieldValue('supplierSku'),
      memo: getFieldValue('memo'),
      skuExtras: skuItems,
      extras: {
        isBoutique: this.state.isBoutique,
        productType: this.state.productType,
      },
    };
    if (productId) {
      this.props.updateProduct(productId, params);
    } else {
      this.props.saveProduct(params);
      // this.context.router.goBack();
    }
    // this.setState({
    //   skuItems: changeCaseKeys(skuItems, 'camelize', 10),
    // });
  }

  onCancelClick = (e) => {
    this.context.router.goBack();
  }

  onClickAddBoutique = (e) => {
    const isBoutique = e.target.checked;
    const productType = this.state.productType;
    this.setState({
      isBoutique: isBoutique,
    });
    this.updateBoutiqueSkus(productType, isBoutique);
  }

  onClickProductType = (e) => {
    const isBoutique = this.state.isBoutique;
    const productType = e.target.value;
    this.setState({
      productType: productType,
    });
    this.updateBoutiqueSkus(productType, isBoutique);
  }

  onClickSourceType = (e) => {
    const sourceType = e.target.value;
    this.setState({
      sourceType: sourceType,
    });
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

  getCategory = (catgoryIds) => {
    const categorys = catgoryIds[catgoryIds.length - 1].split('-');
    return categorys[categorys.length - 1];
  }

  getSkuByName = (sku, key) => {
    let value;
    sku = JSON.parse(sku);
    if (sku.name.indexOf(key) >= 0) {
      value = sku.value;
    }
    return value;
  }

  findSkuItems = (skuExtras, sku) => {
    const skuItems = [];
    const unionSkuName = '统一规格';
    if (!skuExtras || skuExtras.length === 0) {
      return skuItems;
    }
    const firstSku = skuExtras[0];
    each(sku.items.toJS(), (item) => {
      if (firstSku.color === unionSkuName) {
        if (firstSku.color === item.name) {
          skuItems.push(item.id);
        }
      } else {
        if (firstSku.color && item.name !== unionSkuName) {
          skuItems.push(item.id);
        }
        if (firstSku.propertiesName && item.name !== unionSkuName) {
          skuItems.push(item.id);
        }
      }
    });
    return skuItems;
  }

  findAndUnionSkuValues = (skuExtras, sku) => {
    const skuItems = sku.items.toJS();
    const skuItemValues = [];
    const extraSkuItems = [];
    const colors = [];
    const sizes = [];
    const selected = {};
    let colorId = 0;
    let sizeId = 0;
    each(skuItems, (item) => {
      if (item.name === '尺码') {
        sizeId = item.id;
      }
      if (item.name === '颜色') {
        colorId = item.id;
      }
      each(item.values, (value) => {
        each(value.children, (children) => {
          skuItemValues.push(children.value);
        });
      });
    });

    map(groupBy(skuExtras, 'color'), (items, key) => {
      if (key === '统一规格' || key === '') return;
      const itemKey = JSON.stringify({
        id: colorId,
        name: '颜色',
        value: key,
      });
      colors.push(itemKey);
      if (!includes(skuItemValues, itemKey)) {
        each(skuItems, (item) => {
          if (item.id === colorId) {
            extraSkuItems.push({
              id: colorId,
              skuValue: this.generateSkuValue(colorId, '颜色', key),
            });
          }
        });
      }
    });

    map(groupBy(skuExtras, 'propertiesName'), (items, key) => {
      if (key === '统一规格' || key === '') return;
      const itemKey = JSON.stringify({
        id: sizeId,
        name: '尺码',
        value: key,
      });
      sizes.push(itemKey);
      if (!includes(skuItemValues, itemKey)) {
        each(skuItems, (item) => {
          if (item.id === sizeId) {
            extraSkuItems.push({
              id: sizeId,
              skuValue: this.generateSkuValue(sizeId, '尺码', key),
            });
          }
        });
      }
    });
    if (extraSkuItems.length > 0) {
      this.props.batchAddSku(extraSkuItems);
    }

    if (!isEmpty(colors) && colorId > 0) {
      selected[`skus-${colorId}`] = colors;
    }

    if (!isEmpty(sizes) && sizeId > 0) {
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

  isVirtualCoupon = (productType, isBoutique) => (
    isBoutique && productType.toString() === '1'
  )

  updateBoutiqueSkus = (productType, isBoutique) => {
    const { getFieldValue } = this.props.form;
    const { product, sku } = this.props;
    if (isEmpty(product.skuExtras) && toInteger(productType) === 1 && isBoutique === true) {
      const selected = this.findAndUnionSkuValues(boutiqueSkuTpl, sku);
      const skuItems = this.findSkuItems(boutiqueSkuTpl, sku);
      this.props.form.setFieldsInitialValue({
        skuItems: skuItems,
        ...selected,
      });
      assign(this.state, {
        skus: selected,
        skuItems: boutiqueSkuTpl,
      });
    }

    if (isEmpty(product.skuExtras) && isBoutique === false) {
      const selected = this.findAndUnionSkuValues([], sku);
      const skuItems = this.findSkuItems([], sku);
      this.props.form.setFieldsInitialValue({
        skuItems: skuItems,
        ...selected,
      });
      assign(this.state, {
        skus: selected,
        skuItems: [],
      });
    }
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
    let endCol = null;
    if (this.isVirtualCoupon(this.state.productType, this.state.isBoutique) === true) {
      endCol = {
        title: this.columnTitle('精品积分', 'eliteScore'),
        key: 'eliteScore',
        dataIndex: 'eliteScore',
        render: (data, record) => <Input type="text" data-type="eliteScore" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      };
    } else {
      endCol = {
        title: this.columnTitle('商家编码', 'supplierSkucode'),
        key: 'supplierSkucode',
        dataIndex: 'supplierSkucode',
        render: (data, record) => <Input type="text" data-type="supplierSkucode" data-sku={JSON.stringify(record)} value={data} onInput={this.onInput} />,
      };
    }

    return {
      columns: [{
        title: '规格',
        key: 'sku',
        width: '20%',
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
      }, endCol],
      pagination: false,
    };
  }

  formItemLayout = () => ({
    labelCol: { span: 2 },
    wrapperCol: { span: 14 },
  })

  render() {
    const { product, categories, supplier, sku, uptoken } = this.props;
    const { getFieldProps, getFieldValue, setFieldsValue, getFieldsValue } = this.props.form;
    const selected = this.state.skus;
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
              {...getFieldProps('fileList')}
              uptoken={uptoken.token}
              fileList={getFieldValue('fileList')}
              onRemove={this.onRemove}
              onChange={this.onChange}
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="备注提醒">
            <Input
              {...getFieldProps('memo')}
              value={getFieldValue('memo')}
              placeholder="请输入备注提醒"
              type="textarea"
              rows={2}
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="货物来源">
            <Row style={{ marginTop: 16 }}>
              <Col span="16">
                <Radio.Group
                  {...getFieldProps('sourceType')}
                  value={this.state.sourceType}
                  onChange={this.onClickSourceType}>
                  {map(sourceTypes, (type) => (<Radio.Button value={type.id}>{type.lable}</Radio.Button>))}
                </Radio.Group>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="商品类型">
            <Row style={{ marginTop: 16 }}>
              <Col span="10">
                <Radio.Group
                  {...getFieldProps('productType')}
                  value={this.state.productType}
                  onChange={this.onClickProductType}>
                  {map(productTypes, (type) => (<Radio.Button value={type.id}>{type.lable}</Radio.Button>))}
                </Radio.Group>
              </Col>
              <Col span="4">
                <Checkbox
                  {...getFieldProps('isBoutique')}
                  checked={this.state.isBoutique}
                  onChange={this.onClickAddBoutique}>
                  加入精品汇
                </Checkbox>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="类目" required>
            <Cascader
              {...getFieldProps('saleCategory')}
              options={options}
              onChange={this.onCategoryChange}
              value={getFieldValue('saleCategory')}
              placeholder="请选择类目"
              />
          </Form.Item>
          <Form.Item {...this.formItemLayout()} label="规格" required>
            <Select
              {...getFieldProps('skuItems')}
              onChange={this.onSkuItemsChange}
              value={getFieldValue('skuItems')}
              multiple>
              {sku.items.toJS().map((item) =>
                (<Select.Option value={item.id}>{item.name}</Select.Option>)
              )}
            </Select>
          </Form.Item>
          {sku.items.toJS().map((skuItem) => {
            getFieldProps(`skus-${skuItem.id}`);
            if (skuItem.id !== 0 && includes(getFieldValue('skuItems'), skuItem.id)) {
              return (
                <Form.Item {...this.formItemLayout()} label={skuItem.name} required>
                  <TreeSelect
                    showCheckedStrategy={TreeSelect.SHOW_CHILD}
                    treeData={skuItem.values}
                    placeholder={`请选择${skuItem.name}`}
                    onChange={this.onSkusChange}
                    value={getFieldValue(`skus-${skuItem.id}`) || selected[`skus-${skuItem.id}`]}
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
              <Col offset="1" span="16">
                <Table {...this.tableProps()} dataSource={this.state.skuItems} />
              </Col>
            </Row>
          </If>
        </Form>
        <Row style={{ marginTop: 10 }}>
          <Col offset="8" span="2">
            <Button onClick={this.onCancelClick}>返回</Button>
          </Col>
          <Col span="2">
            <Button type="primary" onClick={this.onSaveClick} loading={product.isLoading}>保存</Button>
          </Col>
        </Row>
      </div>
    );
  }

}

export const BasicForm = Form.create()(Basic);
