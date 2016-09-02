export const replaceAllKeys = (object, oldKey, newKey) =>
  (JSON.parse(JSON.stringify(object).replace(new RegExp(oldKey, 'g'), newKey)));
