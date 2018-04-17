var db = require('../database');

var getConsumptionsByPeriod = function (period_id, callback) {
    if (callback && typeof callback === 'function') {
        if (period_id) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'SELECT u.username, c.date, c.sum, c.comment, c.owner_id, c.period_id FROM consumption AS c ' +
                        'INNER JOIN users AS u ON u.id = c.owner_id ' +
                        'WHERE c.period_id = ?;';
                    var params = [
                        period_id
                    ];

                    db.queryParam(connection, sql, params, function (err, results, fields) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        callback(err, results, fields);
                    });
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var createConsumpiton = function (user_id, period_id, comment, date, sum, callback) {
    if (callback && typeof callback === 'function') {
        if (user_id && period_id && date && sum) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'insert into consumption(`date`, `comment`, `sum`, `owner_id`, `period_id`) ' +
                        'values (?, ?, ?, ?, ?);';
                    var params = [
                        date,
                        comment,
                        sum,
                        user_id,
                        period_id
                    ];
                    db.queryParam(connection, sql, params, function (err) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var deleteConsumption = function (user_id, cons_id, callback) {
    if (callback && typeof callback === 'function') {
        if (user_id && cons_id) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'delete from consumption where `owner_id` = ? and `consumption_id` = ?;';
                    var param = [
                        user_id,
                        cons_id
                    ];

                    db.queryParam(connection, sql, param, function (err) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var updateConsumption = function (user_id, cons_id, comment, date, sum, callback) {
    if (callback && typeof callback === 'function') {
        if (user_id && cons_id && date && sum) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'update consumption set `date` = ?, `sum` = ?, `comment` = ? where `owner_id` = ? and `consumption_id` = ?;';
                    var params = [
                        date,
                        sum,
                        comment,
                        user_id,
                        cons_id
                    ];
                    db.queryParam(connection, sql, params, function (err) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    });
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

exports.module = {
    updateConsumption: updateConsumption,
    deleteConsumption: deleteConsumption,
    createConsumpiton: createConsumpiton,
    getConsumptionsByPeriod: getConsumptionsByPeriod
};