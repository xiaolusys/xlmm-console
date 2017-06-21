import axios from 'axios';
import * as constants from 'constants';
import qs from 'qs';

export const checkAuth = (nextState, replace) => {
  // ui.loadingSpinner.show();
  const loginUrl = `${encodeURIComponent(window.location.pathname + window.location.hash + nextState.location.search)}`;
  axios.get(`${constants.apisBase.auth}user/current_user`)
    .then((resp) => {
      // ui.loadingSpinner.hide();
      // next();
      if (resp.status === 403) {
        window.location.replace(`/admin/login/?next=${loginUrl}`);
      }
    })
    .catch((resp) => {
      if (resp.status === 403) {
        window.location.replace(`/admin/login/?next=${loginUrl}`);
      }
    });
};
