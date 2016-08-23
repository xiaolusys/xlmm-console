import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/categories/Home';
import { Edit } from 'modules/categories/Edit';
import { Products } from 'modules/categories/Products';

export default (
  <Route path="/categories" breadcrumbName="选品类目">
    <IndexRoute component={Home} />
    <Route path="/categories/edit" breadcrumbName="编辑" component={Edit} />
    <Route path="/categories/products" breadcrumbName="商品" component={Products} />
  </Route>
);
