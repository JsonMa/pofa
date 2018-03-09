const _ = require('lodash');
const assert = require('assert');
const uuidv4 = require('uuid/v4');
const Promise = require('bluebird');

/**
 *
 * 初始化model, 并注入其依赖项
 *
 * @class Initiater
 */
module.exports = class Initiater {
  /**
   * Creates an instance of Initiater.
   * @memberof Initiater
   *
   * @param {App} app - Egg Application
   */
  constructor(app) {
    this.app = app;
    this.values = {};
    this.userId = '1';
    this.adminId = '1';
  }

  /**
   * 删除injected的models
   *
   * @returns {Promise} 任务
   */
  destory() {
    const values = _.assign(this.values);
    this.values = {};
    return Promise.all(Object.keys(values)
      .map(key => this.app.model[_.upperFirst(_.camelCase(key))]
        .destroy({
          where: {
            id: {
              $in: values[key].map(item => item.id),
            },
          },
          force: true,
        })));
  }

  /**
   * 注入models
   *
   * @param {any} [models=['file']]
   * - 需要初始化的model
   * @memberof Initiater
   * @returns {Promise} 注入model的Map, Promise<Map>
   */
  inject(models) {
    return this._injectDependences(['user', ...models]);
  }

  /**
   *
   *
   * @param {any} [models=['file']]
   * - 需要初始化的model
   * @memberof Initiater
   * @returns {Promise} 注入model的Map, Promise<Map>
   */
  _injectDependences(models = []) {
    return Promise.mapSeries(models, async (key) => {
      if (this.values[key]) return;
      const value = await this[`_inject${_.upperFirst(_.camelCase(key))}`]();
      assert(_.isArray(value), 'value must be format of array!');
      this.values[key] = value;
    });
  }

  /**
   *
   *
   * @param {any} model       - 需要获取的model
   * @param {any} [limit={}]  - 需要匹配的条件，key-value
   * @returns {Promise} 匹配的model
   * @memberof Initiater
   */
  _getRandomItem(model, limit = {}) {
    const target = this.values[model];
    assert(target, `dependences '${model}' are required !`);

    if (_.isArray(target)) {
      const arr = target.slice();
      if (!limit) {
        return _.sample(arr);
      }
      while (arr) {
        const item = arr.pop();
        if (_.isMatch(item, limit)) {
          return item;
        }
      }
      assert(false, `can not find injected model of ${model}`);
    }

    return assert(false, 'unsupport type of model!');
  }

  /**
   * 注入user
   *
   * @returns {Promise} 已注入的users, Promise<Array<User>>
   * @memberof Initiater
   */
  _injectUser() {
    return this.app.model.User.bulkCreate([{
      id: this.userId,
      name: 'shubang-test-user-1',
      phone: '12312341234',
      password: 'shubang-test-password',
    }]);
  }

  /**
   * 注入files及其依赖model
   *
   * @returns {Promise} 已注入的files, Promise<Array<File>>
   * @memberof Initiater
   */
  _injectFile() {
    // inject files ...
    return this.app.model.File.bulkCreate([{
      name: 'file1',
      path: 'file://mock-file1',
      type: 'image/png',
      size: 1024,
    },
    {
      name: 'file2',
      path: 'file://mock-file2',
      type: 'image/png',
      size: 1024,
    },
    ]);
  }

};
