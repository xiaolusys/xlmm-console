import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/schedule/Home';

export default (
  <Route path="/schedule" breadcrumbName="排期" component={Home}>
    <Route path="/schedule/edit/:id" breadcrumbName="编辑:id" component={Home} />
  </Route>
);
