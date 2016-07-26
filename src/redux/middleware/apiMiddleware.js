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
  transformRequest: [(data) => (data ? JSON.stringify(changeCaseKeys(data, 'underscored', 10)) : {})],
  transformResponse: [(data) => {
    let payload = {};
    try {
      payload = JSON.parse(data);
      payload = changeCaseKeys(payload, 'camelize', 10);
    } catch (e) {
      payload = data;
    }
    return payload;
  }],
  paramsSerializer: (params) => Qs.stringify(changeCaseKeys(params, 'underscored', 10), { arrayFormat: 'indices' }),
  timeout: 1000 * 5,
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
