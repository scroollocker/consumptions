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
    return db.createTable('groups_period', {
        columns: {
            grouprs_period_id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            group_id: {
                type: 'int',
                notNull: true
            },
            period_id: {
                type: 'int',
                notNull: true
            }
        },
        ifNotExists: true
    });
};

exports.down = function(db) {
    return db.dropTable('groups_period', { ifExists: true });
};

exports._meta = {
  "version": 1
};
