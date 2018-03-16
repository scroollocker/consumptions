'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('period_status', {
      columns: {
          period_status_id: {
              type: 'int',
              primaryKey: true,
              autoIncrement: true,
              notNull: true,
          },
          code: {
              type: 'string',
              notNull: true
          },
          name: {
              type: 'string'
          }
      },
      ifNotExists: true
  });
  return db.runSql('insert into period_status(code, name) ' +
      'values ' +
      '(\'ACTIVE\', \'Активный\'),' +
      '(\'UNACTIVE\', \'Не активный\');');
};

exports.down = function(db) {
  return db.dropTable('period_status', { ifExists: true });
};

exports._meta = {
  "version": 1
};
