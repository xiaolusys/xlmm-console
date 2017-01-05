import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Oprations } from 'modules/operations/Home';
import { ChangeMmUpper } from 'modules/operations/ChangeMmUpper';

export default (
  <Route path="/operations" breadcrumbName="运营操作">
    <IndexRoute component={Oprations} />
    <Route path="/operations/changemmupper" breadcrumbName="更改推荐关系" component={ChangeMmUpper} />
  </Route>
);
