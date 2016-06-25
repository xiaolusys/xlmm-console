import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/schedule/Home';

export default (
  <Route>
    <IndexRoute component={Home} />
    <Route path="/schedule" component={Home} />
  </Route>
);
