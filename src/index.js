import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { Provider } from 'react-redux';
import routes from 'routes';
import configureStore from 'redux/configureStore';

const history = useRouterHistory(createHashHistory)({
  queryKey: false,
});
const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#container')
);
