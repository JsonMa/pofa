const co = require('co');
const Sequelize = require('sequelize');

const {
  UUID,
  UUIDV1,
  INTEGER,
  STRING,
  BOOLEAN,
  ENUM,
  TEXT,
  ARRAY,
  DATE,
  FLOAT,
} = Sequelize;

const tables = {
  file: {
    id: {
      type: UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: STRING(64),
      allowNull: false,
    },
    path: {
      type: STRING(128),
      allowNull: false,
    },
    type: {
      type: STRING(128),
      allowNull: false,
    },
    size: {
      type: INTEGER,
    },
  },
};

// 一期表结构
Object.assign(tables, {
  admin_user: {
    id: {
      type: INTEGER(32),
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    account: {
      type: STRING(64),
      allowNull: false,
    },
    nickname: STRING(64),
    password: {
      type: STRING(32),
      allowNull: false,
    },
    tel: STRING(16),
    email: STRING(128),
    wechat: STRING(16),
    remark: STRING(255),
    role_id: {
      type: INTEGER(32),
      allowNull: false,
      autoIncrement: true,
    },
    create_time: {
      type: DATE,
      defaultValue: Sequelize.fn('NOW'),
      allowNull: false,
    },
    create_uid: INTEGER(32),
    update_time: {
      type: DATE,
      defaultValue: Sequelize.fn('NOW'),
      allowNull: false,
    },
    update_uid: INTEGER(32),
    company_id: INTEGER(32),
  },
});

module.exports = {
  up: co.wrap(function* (queryInterface) {
    yield Promise.all(Object.keys(tables)
      .map(key => [key, Object.assign({}, tables[key], {
        deleted_at: DATE,
        updated_at: DATE,
        created_at: DATE,
      })]).map(([name, schema]) => queryInterface.createTable(name, schema)));

    yield queryInterface.sequelize.query(`
      -- order no sequence
      CREATE SEQUENCE increment_order_no START WITH 10000000 INCREMENT BY 1;
      ALTER TABLE IF EXISTS "order" ALTER COLUMN no SET DEFAULT nextval('increment_order_no');

      -- admin and user id sequence
      CREATE SEQUENCE increment_user_id START WITH 1 INCREMENT BY 2;
      ALTER TABLE IF EXISTS system_driver_info ALTER COLUMN id SET DEFAULT nextval('increment_user_id');

      CREATE SEQUENCE increment_admin_id START WITH 2 INCREMENT BY 2;
      ALTER TABLE IF EXISTS admin_user ALTER COLUMN id SET DEFAULT nextval('increment_admin_id');
    `);
  }),
  down: co.wrap(function* (queryInterface) {
    yield queryInterface.removeConstraint('post_hits', 'post_id');
    yield Promise.all(Object.keys(tables).map(key => queryInterface.dropTable(key)));
    yield queryInterface.sequelize.query('DROP SEQUENCE increment_admin_id, increment_user_id, increment_order_no');
  }),
};
