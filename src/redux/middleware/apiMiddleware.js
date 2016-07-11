import axios from 'axios';
import Qs from 'qs';
import _ from 'lodash';
import changeCaseKeys from 'change-case-keys';

axios.defaults = _.assign(axios.defaults, {
  headers: {
    get: { 'Content-Type': 'application/json, text/plain, */*' },
    patch: { 'Content-Type': 'application/json' },
    post: { 'Content-Type': 'application/json' },
    put: { 'Content-Type': 'application/json' },
  },
  transformRequest: [(data) => JSON.stringify(changeCaseKeys(data, 'underscored', 10))],
  transformResponse: [(data) => changeCaseKeys(JSON.parse(data), 'camelize', 10)],
  paramsSerializer: (params) => Qs.stringify(changeCaseKeys(params, 'underscored', 10), { arrayFormat: 'indices' }),
  timeout: 1000,
  maxRedirects: 3,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'csrfmiddlewaretoken',
});

export const apiMiddleware = store => next => action => {
  if (action.url) {
    return next({
      type: action.type,
      payload: {
        promise: axios(action),
      },
      success: action.success || _.noop,
      error: action.error || _.noop,
    });
  }
  return next(action);
};
