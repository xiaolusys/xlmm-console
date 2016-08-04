import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App } from 'modules/App';
import scheduleRoutes from 'modules/schedule/routes';
import supplierRoutes from 'modules/supplier/routes';


export default (
  <Route path="/" component={App}>
    {scheduleRoutes}
    {supplierRoutes}
  </Route>
);
