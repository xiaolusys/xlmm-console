import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/apppushmsg/Home';
import { Edit } from 'modules/apppushmsg/Edit';

export default (
  <Route path="/apppushmsgs" breadcrumbName="App推送">
    <IndexRoute component={Home} />
    <Route path="/apppushmsgs/edit" breadcrumbName="编辑" component={Edit} />
  </Route>
);

