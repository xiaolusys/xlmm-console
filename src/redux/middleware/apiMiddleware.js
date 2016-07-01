import axios from 'axios';
import Qs from 'qs';
import _ from 'lodash';
import changeCaseKeys from 'change-case-keys';

axios.defaults = _.assign(axios.defaults, {
  transformRequest: [(data) => Qs.stringify(changeCaseKeys(data, 'underscored', 10), { arrayFormat: 'indices' })],
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
    });
  }
  return next(action);
};
