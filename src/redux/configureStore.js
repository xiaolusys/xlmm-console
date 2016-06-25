import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { batchedSubscribe } from 'redux-batched-subscribe';
import { unstable_batchedUpdates as batchedUpdates } from 'react-dom'; // eslint-disable-line
import createLogger from 'redux-logger';
import reducer from './reducer';
import { promiseMiddleware } from './middleware/promiseMiddleware';
import { apiMiddleware } from './middleware/apiMiddleware';

const __PRODUCTION__ = __PRODUCTION__ || process.env.NODE_ENV === 'production'; // eslint-disable-line

const logger = createLogger({
  collapsed: true,
  predicate: () =>
    process.env.NODE_ENV === 'development',
});

const middlewares = [
  apiMiddleware,
  promiseMiddleware(),
  thunkMiddleware, !__PRODUCTION__ && __CLIENT__ && logger, // eslint-disable-line
].filter(Boolean);

const createStoreWithMiddleware = applyMiddleware(
  ...middlewares,
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState, batchedSubscribe(batchedUpdates));
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../', () => {
      const nextRootReducer = require('../index').default;
      store.replaceReducer(nextRootReducer);
    });
  }
  return store;
}
