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
    return db.createTable('consumption', {
        columns: {
            consumption_id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            date: {
                type: 'datetime',
                notNull: true
            },
            comment: {
                type: 'string'
            },
            sum: {
                type: 'int',
                notNull: true
            },
            owner_id: {
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
  return db.dropTable('consumption', { ifExists: true });
};

exports._meta = {
  "version": 1
};
