import React from 'react';
import { Route } from 'react-router';
import { App } from 'modules/App';
import scheduleRoutes from 'modules/schedule/routes';

export default (
  <Route path="/" component={App}>
    {scheduleRoutes}
  </Route>
);
