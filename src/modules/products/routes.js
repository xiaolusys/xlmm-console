import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/products/Home';
import { ProductEdit } from 'modules/products/Edit';

export default (
  <Route path="/stockproducts" breadcrumbName="商品列表">
    <IndexRoute component={Home} />
    <Route path="/stockproduct/edit" breadcrumbName="编辑" component={ProductEdit} />
  </Route>
);
