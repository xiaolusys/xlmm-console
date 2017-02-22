import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/statistics/Home';
import { Sales } from 'modules/statistics/Sales';
import { Deliverys } from 'modules/statistics/Delivery';

export default (
  <Route path="/statistics" breadcrumbName="数据统计">
    <IndexRoute component={Home} />
    <Route path="/statistics/sales" breadcrumbName="销售统计" component={Sales} />
    <Route path="/statistics/delivery" breadcrumbName="发货统计" component={Deliverys} />
  </Route>
);
