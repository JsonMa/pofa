const fs = require('fs');
const path = require('path');

const ERROR_TEMPLATE = Symbol.for('Application#errorTemplate');

/* istanbul ignore next */
module.exports = {
  get isProd() {
    return this.config.env === 'prod';
  },

  get isTest() {
    return this.config.env === 'test';
  },

  get errorTemplate() {
    if (!this[ERROR_TEMPLATE]) {
      this[ERROR_TEMPLATE] = fs.readFileSync(path.join(__dirname, '../view/error.nj'), 'utf-8');
    }
    return this[ERROR_TEMPLATE];
  },
};
