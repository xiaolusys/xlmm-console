import axios from 'axios';
import * as constants from 'constants';
import qs from 'qs';

export const checkAuth = (nextState, replace) => {
  // ui.loadingSpinner.show();
  axios.get(`${constants.apisBase.auth}user/current_user`)
    .then((resp) => {
      // ui.loadingSpinner.hide();
      // next();
      if (resp.status === 403) {
        window.location.replace(`/admin/login/?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`);
      }
    })
    .catch((resp) => {
      if (resp.status === 403) {
        window.location.replace(`/admin/login/?next=${encodeURIComponent(nextState.location.pathname + nextState.location.search)}`);
      }
    });
};
