import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/activity/Home';
import { Edit } from 'modules/activity/Edit';
import { ActivityProducts } from 'modules/activity/Products';

export default (
  <Route path="/activities" breadcrumbName="商城活动">
    <IndexRoute component={Home} />
    <Route path="/activity/edit" breadcrumbName="编辑" component={Edit} />
    <Route path="/activity/products" breadcrumbName="活动产品" component={ActivityProducts} />
  </Route>
);
