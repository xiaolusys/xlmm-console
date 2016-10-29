import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/ninepic/Home';
import { Edit } from 'modules/ninepic/Edit';

export default (
  <Route path="/ninepics" breadcrumbName="九张图">
    <IndexRoute component={Home} />
    <Route path="/ninepics/edit" breadcrumbName="编辑" component={Edit} />
  </Route>
);
