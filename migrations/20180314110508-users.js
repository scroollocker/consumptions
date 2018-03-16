'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db) {
    return db.createTable('users', {
        columns: {
            id: {
                type: 'int',
                primaryKey: true,
                autoIncrement: true,
                notNull: true,
            },
            username: {
                type: 'string',
                notNull: true,
            },
            password: {
                type: 'string',
                notNull: true,
            },
            isAdmin: {
                type: 'boolean',
                notNull: true,
                defaultValue: false
            },
            createDate: {
                type: 'datetime',
                notNull: false,
                defaultValue: null
            },
            expDate: {
                type: 'datetime',
                notNull: false,
                defaultValue: null
            }
        },
        ifNotExists: true,
    });
};

exports.down = function (db) {
    return db.dropTable('users', { ifExists: true });
};

exports._meta = {
    "version": 1
};
