export menu from './menu';
export scheduleTypes from './scheduleTypes';
export priceRanges from './priceRanges';
export const apisBase = {
  supply: '/apis/chain/v1/',
  auth: '/apis/auth/v1/',
  xiaolumm: '/apis/xiaolumm/v1/',
  apppushmsg: '/apis/protocol/v1/',
};
export const uploadUrl = (window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com');
export const imageUrlPrefixs = '//img.xiaolumeimei.com/';

export const sizeSortCursor = 'SMLXSXMXLXXL0A1B2C3D4E5F607080909510112013014015016017018019宝妈爸'.split('');
