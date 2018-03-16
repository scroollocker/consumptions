
var mysql = require('mysql');
var dbConfig = require('../database.json');
const ENV = process.env.DB_CONFIG || 'dev';

var openConnection = function (callback) {
    if (callback !== undefined && typeof callback === 'function') {
        var connection = mysql.createConnection({
            host     : dbConfig[ENV].host,
            user     : dbConfig[ENV].user,
            password : dbConfig[ENV].password,
            database : dbConfig[ENV].database
        });

        connection.connect(function (err) {
            if (err) {
                callback(err);
                return;
            }

            callback(null, connection);
        });

    }

};

var closeConnection = function (connection, callback) {
    if (callback !== undefined && typeof callback === 'function') {
        if (connection !== null && connection !== undefined) {
            connection.end(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        }
    }
};

var query = function (connection, sql, callback) {
    if (callback !== undefined && typeof callback === 'function') {
        if (connection !== null && connection !== undefined) {
            connection.query(sql, function (err, res, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    closeConnection(connection, function (error) {
                        if (error) {
                            callback(error);
                        }
                        else {
                            callback(null, res, fields);
                        }
                    });
                }
            });
        }
        else {
            callback(new Error('Connection variable is null'));
        }
    }
};

var queryParam = function (connection, sql, params, callback) {
    if (callback !== undefined && typeof callback === 'function') {
        if (connection !== null && connection !== undefined) {
            if (params === undefined || params === null) {
                params = [];
            }
            connection.query(sql, params, function (err, res, fields) {
                if (err) {
                    callback(err);
                }
                else {
                    closeConnection(connection, function (err) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null, res, fields);
                        }
                    });
                }
            });
        }
        else {
            callback(new Error('Connection variable is null'));
        }
    }
};


module.exports = {
    openConnection : openConnection,
    closeConnection : closeConnection,
    query : query,
    queryParam : queryParam
};