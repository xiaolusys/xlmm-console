import axios from 'axios';
import Qs from 'qs';
import { assign, noop } from 'lodash';
import changeCaseKeys from 'change-case-keys';

axios.defaults = assign(axios.defaults, {
  headers: {
    get: { 'Content-Type': 'application/json, text/plain, */*' },
    patch: { 'Content-Type': 'application/json' },
    post: { 'Content-Type': 'application/json' },
    put: { 'Content-Type': 'application/json' },
    delete: { 'Content-Type': 'application/json' },
  },
  validateStatus: function (status) {
    return status >= 200;
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
  paramsSerializer: (params) => Qs.stringify(changeCaseKeys(params, 'underscored', 10)),
  timeout: 1000 * 30,
  maxRedirects: 3,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'csrfmiddlewaretoken',
});

// reverse array: Qs.stringify(changeCaseKeys(params, 'underscored', 10), { arrayFormat: 'indices' })

export const apiMiddleware = store => next => action => {
  if (action.url) {
    // console.log('start apiMiddleware');
    // console.log(action);
    return next({
      type: action.type,
      payload: {
        promise: axios(action),
      },
      success: action.success || noop,
      error: action.error || noop,
    });
  }
  return next(action);
};
