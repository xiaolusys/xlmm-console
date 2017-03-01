import moment from 'moment';

export const replaceAllKeys = (object, oldKey, newKey) =>
  (JSON.parse(JSON.stringify(object).replace(new RegExp(oldKey, 'g'), newKey)));

export const toErrorMsg = (error) => {
  const errMsgs = [];
  if (error.detail) {
    errMsgs.push(error.detail);
  } else {
	const values = [];
	Object.keys(error).forEach((key) => {
      errMsgs.push(error[key][0]);
    });
  }
  return errMsgs.join(',');
};

export const getDateRangeItems = () => {
  const today = new Date();
  const yesterday = new Date().setDate(today.getDate() - 1);
  return {
    昨日: [moment(yesterday), moment(yesterday)],
    前日: [moment(new Date().setDate(today.getDate() - 2)), moment(new Date().setDate(today.getDate() - 2))],
    三天前: [moment(new Date().setDate(today.getDate() - 3)), moment(yesterday)],
    七天前: [moment(new Date().setDate(today.getDate() - 7)), moment(yesterday)],
    一个月前: [moment(new Date().setDate(today.getDate() - 30)), moment(yesterday)],
  };
};
