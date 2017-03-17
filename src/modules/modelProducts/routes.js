import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/modelProducts/Home';
import { Edit } from 'modules/modelProducts/Edit';

export default (
  <Route path="/modelProducts" breadcrumbName="款式列表">
    <IndexRoute component={Home} />
    <Route path="/modelProducts/edit" breadcrumbName="编辑" component={Edit} />
  </Route>
);
