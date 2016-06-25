import axios from 'axios';
export const apiMiddleware = store => next => action => {
  if (action.url) {
    const requestPromise = axios(action);
    next({
      type: action.type,
      payload: {
        promise: requestPromise
          .promise()
          .then(res => res.body)
          .catch(res => {
            const data = res.res;
            if (action.always) {
              action.always(data, store.dispatch);
            }
            if (action.failure) {
              action.failure(data, store.dispatch);
            }
          })
          .tap(resp => {
            if (action.always) {
              setTimeout(() => action.always(resp, store.dispatch), 10);
            }
          })
          .tap(resp => {
            if (action.done) {
              action.done && action.done(resp, store.dispatch);
            }
          }),
        data: { ...action.data },
      },
    });
  } else {
    next(action);
  }
};
