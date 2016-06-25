import R from 'ramda';

const isPromise = (value) =>
  (value !== null && typeof value === 'object' && value.promise && typeof value.promise.then === 'function');

const defaultTypes = ['REQUEST', 'SUCCESS', 'FAILURE'];

export const promiseMiddleware = (config = {}) => {
  const promiseTypeSuffixes = config.promiseTypeSuffixes || defaultTypes;
  return (refs) => {
    const dispatch = refs.dispatch;
    return next => action => {
      if (!isPromise(action.payload)) {
        return action;
      }
      const { type, payload, meta } = action;
      const { promise, data } = payload;
      const [REQUEST, SUCCESS, FAILURE] = (meta || {}).promiseTypeSuffixes || promiseTypeSuffixes;
      /**
       * Dispatch the first async handler. This tells the
       * reducer that an async action has been dispatched.
       */
      next({
        type: `${type}_${REQUEST}`,
        ...!!data ? {
          payload: data,
        } : {},
        ...!!meta ? { meta } : {},
      });

      const isAction = resolved => resolved && (resolved.meta || resolved.payload);
      const isThunk = resolved => typeof resolved === 'function';
      const getResolveAction = isError => ({
        type: `${type}_${isError ? FAILURE : SUCCESS}`,
        ...!!meta ? { meta } : {},
        ...!!isError ? { error: true } : {},
      });

      /**
       * Re-dispatch one of:
       *  1. a thunk, bound to a resolved/rejected object containing ?meta and type
       *  2. the resolved/rejected object, if it looks like an action, merged into action
       *  3. a resolve/rejected action with the resolve/rejected object as a payload
       */
      const newAction = action;
      newAction.payload.promise = promise.then(
        (resolved = {}) => {
          let resolveAction = getResolveAction();
          if (!R.isEmpty(resolved)) {
            return dispatch(isThunk(resolved) ? resolved.bind(null, resolveAction) : {
              ...resolveAction,
              ...isAction(resolved) ? resolved : {
                ...!!resolved && {
                  payload: resolved,
                },
              },
            });
          }
          resolveAction = getResolveAction(true);
          return dispatch(isThunk(resolved) ? resolved.bind(null, resolveAction) : {
            ...resolveAction,
            ...isAction(resolved) ? resolved : {
              ...!!resolved && {
                payload: resolved,
              },
            },
          });
        },
        (rejected = {}) => {
          const resolveAction = getResolveAction(true);
          return dispatch(isThunk(rejected) ? rejected.bind(null, resolveAction) : {
            ...resolveAction,
            ...isAction(rejected) ? rejected : {
              ...!!rejected && {
                payload: rejected,
              },
            },
          });
        },
      );

      return newAction;
    };
  };
};
