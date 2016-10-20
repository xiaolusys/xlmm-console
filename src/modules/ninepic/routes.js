import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/ninepic/Home';
// import { Edit } from 'modules/ninepic/Edit';

export default (
  <Route path="/ninepics" breadcrumbName="每日推送">
    <IndexRoute component={Home} />
  </Route>
);
