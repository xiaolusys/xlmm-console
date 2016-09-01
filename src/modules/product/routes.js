import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/product/Home';
import { Edit } from 'modules/product/Edit';

export default (
  <Route path="/product" breadcrumbName="商品">
    <IndexRoute component={Home} />
    <Route path="/product/edit" breadcrumbName="编辑" component={Edit} />
  </Route>
);
