import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/schedule/Home';
import { Edit } from 'modules/schedule/Edit';
import { Products } from 'modules/schedule/Products';

export default (
  <Route path="/schedule" breadcrumbName="排期">
    <IndexRoute component={Home} />
    <Route path="/schedule/edit" breadcrumbName="编辑" component={Edit} />
    <Route path="/schedule/products" breadcrumbName="商品" component={Products} />
  </Route>
);
