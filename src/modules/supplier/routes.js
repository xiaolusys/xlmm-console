import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/supplier/Home';
import { SupplierEdit } from 'modules/supplier/SupplierEdit';
import { Products } from 'modules/supplier/Products';
import { ProductEdit } from 'modules/supplier/ProductEdit';

export default (
  <Route path="/supplier" breadcrumbName="供应商">
    <IndexRoute component={Home} />
    <Route path="/supplier/edit" breadcrumbName="编辑" component={SupplierEdit} />
    <Route path="/supplier/products" breadcrumbName="商品">
      <IndexRoute component={Products} />
      <Route path="/supplier/product/edit" breadcrumbName="编辑" component={ProductEdit} />
    </Route>
  </Route>
);
