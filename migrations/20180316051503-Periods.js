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
    return db.createTable('periods', {
        columns: {
            period_id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            date_start: {
                type: 'datetime',
                notNull: true
            },
            date_end: {
                type: 'datetime',
                notNull: true
            },
            sum: {
                type: 'int',
                notNull: true
            },
            owner_id: {
                type: 'int',
                notNull: true
            }
        },
        ifNotExists: true
    });
};

exports.down = function(db) {
  return db.dropTable('periods', { ifExists: true });
};

exports._meta = {
  "version": 1
};
