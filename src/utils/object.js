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

