import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { App } from 'modules/App';
import scheduleRoutes from 'modules/schedule/routes';
import supplierRoutes from 'modules/supplier/routes';
import categoriesRoutes from 'modules/categories/routes';
import modelproductRoutes from 'modules/modelProducts/routes';
import productRoutes from 'modules/products/routes';
import ninepicRoutes from 'modules/ninepic/routes';
import apppushmsgRoutes from 'modules/apppushmsg/routes';
import activitiesRoutes from 'modules/activity/routes';
import operationsRoutes from 'modules/operations/routes';
import statisticsRoutes from 'modules/statistics/routes';
import packageorderRoutes from 'modules/packageOrder/routes';
import appbannerRoutes from 'modules/appBanners/routes';

export default (
  <Route path="/" component={App}>
    {scheduleRoutes}
    {supplierRoutes}
    {categoriesRoutes}
    {ninepicRoutes}
    {apppushmsgRoutes}
    {activitiesRoutes}
    {modelproductRoutes}
    {productRoutes}
    {operationsRoutes}
    {statisticsRoutes}
    {packageorderRoutes}
    {appbannerRoutes}
  </Route>
);
