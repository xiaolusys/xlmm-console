import _ from 'lodash';

const isPromise = (value) =>
  (value !== null && typeof value === 'object' && value && typeof value.then === 'function');

const defaultTypes = ['REQUEST', 'SUCCESS', 'FAILURE'];

export default (config = {}) => {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;
  return (ref) => {
    const { dispatch } = ref;
    return next => action => {
      if (action.payload) {
        // console.log(action.payload);
        if (!isPromise(action.payload) && !isPromise(action.payload.promise)) {
          return next(action);
        }
      } else {
        return next(action);
      }
      const { type, payload, meta } = action;
      const initialAction = { isLoading: true, success: false, failure: false };
      const [REQUEST, SUCCESS, FAILURE] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;
      const getAction = (newPayload, isRejected) => {
        const errorDetail = newPayload.response ? newPayload.response.data : newPayload.data || {};
        return {
          type: `${type}_${isRejected ? FAILURE : SUCCESS}`,
          ...newPayload ? { payload: newPayload } : {},
          ...!!meta ? { meta } : {},
          status: isRejected ? { isLoading: false, failure: true, success: false, error: errorDetail } : { isLoading: false, failure: false, success: true },
        };
      };

      /**
       * Assign values for promise and data variables. In the case the payload
       * is an object with a `promise` and `data` property, the values of those
       * properties will be used. In the case the payload is a promise, the
       * value of the payload will be used and data will be null.
       */
      let promise;
      let data;
      if (!isPromise(action.payload) && typeof action.payload === 'object') {
        promise = payload.promise;
        data = payload.data;
      } else {
        promise = payload;
        data = null;
      }

      /**
       * First, dispatch the pending action. This flux standard action object
       * describes the pending state of a promise and will include any data
       * (for optimistic updates) and/or meta from the original action.
       */
      next({
        type: `${type}_${REQUEST}`,
        status: initialAction,
        ...action.payload || {},
        ...!!meta ? { meta } : {},
      });

      return promise
        .then((resolved = null) => {
          if (resolved.status === 403) {
            // window.location.replace(`/admin/login/?next=${window.location.pathname}${window.location.hash}`);
            console.log(`/admin/login/?next=${window.location.pathname}${window.location.hash}`);
          }
          if (resolved.status === 200) {
            const resolvedAction = getAction(resolved, false);
            dispatch(resolvedAction);
            action.success(resolved, dispatch);
            return { resolved, action: resolvedAction };
          }
          const rejectedAction = getAction(resolved, true);
          dispatch(rejectedAction);
          action.error(resolved, dispatch);
          return { resolved, action: rejectedAction };
        })
        .catch((rejected) => {
          const rejectedAction = getAction(rejected, true);
          dispatch(rejectedAction);
          action.error(rejected, dispatch);
          return { rejected, action: rejectedAction };
        });
    };
  };
};
