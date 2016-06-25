import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { createHistory } from 'history';
import { Provider } from 'react-redux';
import routes from 'routes';
import configureStore from 'redux/configureStore';

const history = useRouterHistory(createHistory)({
  basename: '/console/',
  queryKey: false,
});
const store = configureStore();
ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.querySelector('#container')
);
