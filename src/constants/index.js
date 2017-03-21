export menu from './menu';
export scheduleTypes from './scheduleTypes';
export priceRanges from './priceRanges';
export { productTypes, sourceTypes, boutiqueSkuTpl } from './product';
export const apisBase = {
  pay: '/apis/pay/',
  supply: '/apis/chain/v1/',
  trades: '/trades/',
  auth: '/apis/auth/v1/',
  xiaolummbase: '/apis/xiaolumm/',
  xiaolumm: '/apis/xiaolumm/v1/',
  apppushmsg: '/apis/protocol/v1/',
  promotion: '/sale/promotion/promotion/',
  item: '/apis/items/v2/',
  coupon: '/coupon/',
  mm: '/mm/',
};
export const uploadUrl = (window.location.protocol === 'https:' ? 'https://up.qbox.me/' : 'http://upload.qiniu.com');
export const imageUrlPrefixs = 'http://img.xiaolumeimei.com/';

export const sizeSortCursor = 'SMLXSXMXLXXL0A1B2C3D4E5F607080909510112013014015016017018019宝妈爸'.split('');
