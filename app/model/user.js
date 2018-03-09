module.exports = (app) => {
  const {
    STRING,
    UUID
  } = app.Sequelize;

  /**
   * 用户Model
   *
   * @model User
   * @namespace Model
   * @property {uuid}    id
   * @property {string}  name               - 用户名
   * @property {string}  password           - 密码 
   * @property {string}  phone              - 电话
   * @property {string}  driver_unionid     - 昵称
   * @property {string}  email              - 邮箱
   *
   */
  const User = app.model.define('system_driver_info', {
    id: {
      type: UUID,
      allowNull: false,
      default: UUID(1)
    },
    name: {
      type: STRING(32),
      allowNull: false,
    },
    phone: {
      type: STRING(32),
      allowNull: true,
    },
    password: {
      type: STRING(64),
      allowNull: false,
    },
    email: {
      type: STRING(32),
      allowNull: true,
    },
    driver_unionid: {
      type: STRING(64),
      allowNull: true,
    }
  }, {
    createdAt: 'create_time',
    updatedAt: 'update_time',
    deletedAt: false,
    paranoid: false,
  });

  return User;
};
