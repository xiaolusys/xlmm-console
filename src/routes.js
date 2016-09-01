import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App } from 'modules/App';
import scheduleRoutes from 'modules/schedule/routes';
import supplierRoutes from 'modules/supplier/routes';
import categoriesRoutes from 'modules/categories/routes';


export default (
  <Route path="/" component={App}>
    {scheduleRoutes}
    {supplierRoutes}
    {categoriesRoutes}
  </Route>
);
