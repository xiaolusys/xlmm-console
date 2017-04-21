import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import wrapReactLifecycleMethodsWithTryCatch from 'react-component-errors';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Card, Checkbox, Col, Form, Input, Cascader, Popover, Radio, Row, TreeSelect, Select, Tag, Table, message } from 'antd';
import { assign, map, difference, each, groupBy, includes, isEmpty, isArray, isMatch, last, merge, sortBy, toInteger, toArray, union, unionBy, uniqBy } from 'lodash';
import { Uploader } from 'components/Uploader';
import { If } from 'jsx-control-statements';
import { fetchCategories } from 'redux/modules/supplyChain/categories';
import { fetchSku, addSku, batchAddSku } from 'redux/modules/products/sku';
import { createProduct, updateProduct, fetchProduct } from 'redux/modules/products/stockProduct';
import { changeTabProduct } from 'redux/modules/products/selectTab';
import { fetchUptoken } from 'redux/modules/supplyChain/uptoken';
import { replaceAllKeys, toErrorMsg } from 'utils/object';
import { imageUrlPrefixs, productTypes, boutiqueSkuTpl } from 'constants';
import changeCaseKeys from 'change-case-keys';

const actionCreators = {
  fetchSku,
  addSku,
  batchAddSku,
  fetchProduct,
  fetchUptoken,
  fetchCategories,
  createProduct,
  updateProduct,
  changeTabProduct,
};


@connect(
  state => ({
    sku: state.sku,
    skus: {},
    skuItems: [],
    uptoken: state.uptoken,
    categories: state.categories,
    productType: state.productType,
    stockProduct: state.stockProduct,
  }),
  dispatch => bindActionCreators(actionCreators, dispatch),
)

@wrapReactLifecycleMethodsWithTryCatch
export class Basic extends Component {

    static propTypes = {
        prefixCls: React.PropTypes.string,
        form: React.PropTypes.object,
        location: React.PropTypes.any,
        product: React.PropTypes.object,
        categories: React.PropTypes.object,
        uptoken: React.PropTypes.object,
        fetchCategories: React.PropTypes.func,
        fetchSupplier: React.PropTypes.func,
        sku: React.PropTypes.array,
        supplier: React.PropTypes.object,
        preference: React.PropTypes.object,
        fetchSku: React.PropTypes.func,
        addSku: React.PropTypes.func,
        batchAddSku: React.PropTypes.func,
        fetchProduct: React.PropTypes.func,
        crawlProduct: React.PropTypes.func,
        createProduct: React.PropTypes.func,
        updateProduct: React.PropTypes.func,
        fetchUptoken: React.PropTypes.func,
        changeTabProduct: React.PropTypes.func,
    };

    static contextTypes = {
        router: React.PropTypes.object,
    };

    constructor(props, context) {
        super(props);
        context.router;
    }

    state = {
      sku: [],
      skus: {},
      productType: '0',
      skuPropsUpdated: false,
      categories: [],
      stockProduct: null,
      skuItems: [],
      uptoken: '',
    }

    componentWillMount() {
      this.props.fetchUptoken();
      this.props.fetchCategories();
    }

  componentWillReceiveProps(nextProps) {
      const { product, sku, stockProduct } = nextProps;
      const { getFieldProps } = this.props.form;
      getFieldProps('skus-0');
      getFieldProps('skus-1');
      getFieldProps('skus-2');
      if (stockProduct && stockProduct.firstLoadUpdate) {
        const { skus } = stockProduct.skuExtras;
        if (stockProduct.picPath) {
          this.props.form.setFieldsInitialValue({
            fileList: [{
              uid: stockProduct.picPath,
              url: stockProduct.picPath,
              name: stockProduct.picPath,
              status: 'done',
            }],
            refLink: stockProduct.refLink,
            name: stockProduct.name,
            memo: stockProduct.memo,
          });
        }
        stockProduct.firstLoadUpdate = false;
        assign(this.state, {
          skuItems: stockProduct.skuExtras,
          productType: stockProduct.type,
          stockProduct: stockProduct,
        });
        const { saleCategory } = stockProduct;
        if (saleCategory) {
          this.props.fetchSku(saleCategory.id);
        }
        return;
      }
      if (stockProduct && stockProduct.saleCategory && sku && sku.success && !sku.skuPropsUpdated) {
        sku.skuPropsUpdated = true;
        const categoryComb = [];
        each(stockProduct.saleCategory.cid.split('-'), (c) => {
          categoryComb.push(categoryComb.length > 0 ? `${categoryComb[categoryComb.length - 1]}-${c}` : c);
        });
        const selected = this.findAndUnionSkuValues(stockProduct.skuExtras, sku);
        const skuItems = this.findSkuItems(stockProduct.skuExtras, sku);
        this.props.form.setFieldsInitialValue({
          saleCategory: categoryComb,
          skuItems: skuItems,
          ...selected,
        });
        assign(this.state, {
          skus: selected,
          sku: sku,
        });
        return;
      }
      if (stockProduct.id && stockProduct.success && !stockProduct.update && !stockProduct.crawl) {
        if (stockProduct.picPath) {
          this.props.form.setFieldsInitialValue({
            fileList: [{
              uid: stockProduct.picPath,
              url: stockProduct.picPath,
              name: stockProduct.picPath,
              thumbUrl: stockProduct.picPath,
              status: 'done',
            }],
          });
        }
        this.props.form.setFieldsInitialValue({
          refLink: stockProduct.refLink,
          name: stockProduct.name,
          memo: stockProduct.memo,
          productType: stockProduct.type,
        });
      }
      if (stockProduct.lastCreated) {
        this.props.changeTabProduct('supply');
        stockProduct.lastCreated = false;
        this.setState({ stockProduct: stockProduct });
      }
      if (stockProduct.lastUpdated) {
        message.success('保存成功！');
        stockProduct.lastUpdated = false;
        this.setState({ stockProduct: stockProduct });
      }
      if (stockProduct.failure) {
        message.error(`请求错误: ${toErrorMsg(stockProduct.error) || ''}`);
      }
      if (sku.failure) {
        message.error(`请求错误: ${toErrorMsg(sku.error) || ''}`);
      }
      if (stockProduct && stockProduct.crawl) {
        this.props.form.setFieldsInitialValue({
          fileList: [{
            uid: stockProduct.picUrl,
            url: stockProduct.picUrl,
            name: stockProduct.picUrl,
            status: 'done',
          }],
          refLink: stockProduct.productLink,
          name: stockProduct.title,
        });
      }
  }

    componentWillUnmount() {
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
          name: getFieldValue('name'),
          refLink: getFieldValue('refLink'),
          picPath: getFieldValue('fileList')[0].url,
          category: this.getCategory(categories),
          memo: getFieldValue('memo'),
          type: this.state.productType,
          skuExtras: skuItems,
        };
        if (productId) {
          this.props.updateProduct(productId, params);
        } else {
          this.props.createProduct(params);
        }
        // this.setState({
        //   skuItems: changeCaseKeys(skuItems, 'camelize', 10),
        // });
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

  onClickProductType = (e) => {
    const productType = e.target.value;
    this.setState({ productType: productType });
  }
  onSkuValueInput = (e) => {
    const { dataset, value } = e.target;
    this.setState({
      [`sku-value-${dataset.id}`]: value,
    });
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

  getSkuByName = (sku, key) => {
    let value;
    sku = JSON.parse(sku);
    if (sku.name.indexOf(key) >= 0) {
      value = sku.value;
    }
    return value;
  }
  getCategory = (catgoryIds) => {
    const categorys = catgoryIds[catgoryIds.length - 1].split('-');
    return categorys[categorys.length - 1];
  }
  formItemLayout = () => ({
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
  })

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
          if (item.name === '颜色') {
            skuItems.push(item.id);
          }
        }
        if (firstSku.size && item.name !== unionSkuName) {
          if (item.name === '尺码') {
            skuItems.push(item.id);
          }
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

    map(groupBy(skuExtras, 'size'), (items, key) => {
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
            size: size,
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
              size: size,
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
            <If condition={record.size}>
              <Tag color="green">{record.size}</Tag>
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

    render() {
      const { product, categories, supplier, sku, uptoken } = this.props;
      const { productId } = this.props.location.query;
      let options = replaceAllKeys(categories.items, 'name', 'label');
      options = replaceAllKeys(options, 'cid', 'value');
      const { getFieldProps, getFieldValue, setFieldsValue } = this.props.form;
      return (
        <div>
          <Form horizontal>
            <Form.Item {...this.formItemLayout()} label="商品名称">
              <Input
                {...getFieldProps('name', { rules: [{ required: true, message: '请输入商品名称！' }] })}
                value={getFieldValue('name')}
                placeholder="请输入商品名称"
                />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="商品链接">
              <Input
                {...getFieldProps('refLink', { rules: [{ required: true, message: '请输入商品链接！' }] })}
                value={getFieldValue('refLink')}
                placeholder="请输入商品链接"
                />
            </Form.Item>
            <Form.Item {...this.formItemLayout()} label="商品头图" required>
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
