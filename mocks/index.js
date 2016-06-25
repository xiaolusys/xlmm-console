const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const mockConfig = require('./mock.config');

module.exports = function() {
  return function(req, resp, next) {
    const mockDir = _.get(mockConfig, req.path) && _.get(mockConfig, req.path)[req.method] ? _.get(mockConfig, req.path)[req.method] : '';
    if (mockDir) {
      const jsonFile = fs.readFileSync(path.join(__dirname, mockDir), 'utf-8');
      req.accepts('application/json');
      resp.type('application/json');
      resp.json(JSON.parse(jsonFile));
      console.log(' --> Request mock: ', req.path);
      return;
    }
    next();
  };
};
