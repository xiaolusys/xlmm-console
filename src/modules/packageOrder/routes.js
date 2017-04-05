import React from 'react';
import { Route, IndexRoute } from 'react-router';
// import  Home  from 'modules/ninepic/Home';
import { Home } from 'modules/packageOrder/Home';
import { EditPackageOrder } from 'modules/packageOrder/WuliuEdit';


export default (
  <Route path="/packageorder" breadcrumbName="包裹">
    <IndexRoute component={Home} />
    <Route path="/packageorder/editwuliu" breadcrumbName="详情" component={EditPackageOrder} />
  </Route>
);
