export menu from './menu';
export scheduleTypes from './scheduleTypes';
export priceRanges from './priceRanges';
export const apisBase = {
  supply: '/apis/chain/v1/',
  auth: '/apis/auth/v1/',
  pmt: '/rest/v1/pmt/',
};
export const uploadUrl = (window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com');
export const imageUrlPrefixs = 'http://img.xiaolumeimei.com/';
