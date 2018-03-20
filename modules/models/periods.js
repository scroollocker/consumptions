var db = require('../database');
var groups = require('./groups');

var getPeriodsByGroup = function (user_id, group_id, callback) {
    if (callback && typeof callback === 'function') {
        if (group_id && group_id !== 0 && user_id && user_id !== 0) {
            groups.getGroupsByUserId(user_id, function (err, res, fields) {
                if (err) {
                    callback(err);
                }
                else if (res.length === 0) {
                    callback(new Error('Not allowed'));
                }
                else {
                    var found = false;
                    res.forEach(function (value) {
                        if (value.group_id == group_id) {
                            found = true;
                        }
                    });
                    if (!found) {
                        callback(new Error('Not Allowed'));
                    }
                    else {
                        db.openConnection(function (err, connection) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                var sql = 'SELECT gp.group_id, gp.period_id, p.date_start, p.date_end, p.sum, p.owner_id, ps.name, u.username ' +
                                    'FROM groups_period AS gp ' +
                                    'INNER JOIN periods AS p ON gp.period_id = p.period_id ' +
                                    'INNER JOIN period_status AS ps ON ps.period_status_id = p.status_id ' +
                                    'INNER JOIN user as u on u.id = p.owner_id ' +
                                    'WHERE ps.code = \'ACTIVE\' AND gp.group_id = ?;';
                                var params = [
                                    group_id
                                ];
                                db.queryParam(connection, sql, params, callback);
                            }
                        });
                    }

                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var createPeriod = function (user_id, group_id, date_start, date_end, sum, callback) {
    if (callback && typeof callback === 'function') {
        if (user_id && user_id !== 0 && group_id && group_id !== 0 && date_start && date_end && sum && sum > 0) {
            groups.getGroupsByUserId(user_id, function (err, results) {
                if (err) {
                    callback(err);
                }
                else if (results.length === 0) {
                    callback(new Error('Not Allowed'));
                }
                else {
                    var found = false;
                    results.forEach(function (value) {
                        if (value.group_id == group_id) {
                            found = true;
                        }
                    });
                    if (!found) {
                        callback(new Error('Not Allowed'));
                    }
                    else {
                        db.openConnection(function (err, connection) {
                            if (err) {
                                callback(err);
                            }
                            else {
                                connection.beginTransaction(function (err) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }

                                    var sql = 'insert into periods(`date_start`, `date_end`, `sum`, `owner_id`, `status_id`) values (?, ?, ?, ?, (select period_status_id from period_status where code = \'ACTIVE\'));';
                                    var params = [
                                        date_start,
                                        date_end,
                                        sum,
                                        user_id
                                    ];

                                    db.queryParam(connection, sql, params, function (err, result) {
                                        if (err) {
                                            connection.rollback(function (err) {
                                               console.log(err);
                                            });
                                            callback(new Error('Insert periods error'));
                                            return;
                                        }

                                        sql = 'insert into groups_period(`period_id`,`group_id`) values(?, ?);';
                                        params = [
                                            results.insertId,
                                            group_id
                                        ];

                                        db.queryParam(connection, sql, params, function (err) {
                                            if (err) {
                                                connection.rollback(function (err) {
                                                    console.log(err);
                                                });
                                                callback(err);
                                            }
                                            else {
                                                connection.commit(function (err) {
                                                   if (err) {
                                                       callback(err);
                                                   }
                                                   else {
                                                       callback(null);
                                                   }
                                                });
                                            }
                                        });
                                    });
                                });
                            }
                        });
                    }
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var deletePeriod = function (user_id, period_id, callback) {
    if (callback && typeof callback === 'function') {
        if (user_id && period_id) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'update periods set `status_id` = (select period_status_id from period_status where code = \'DELETE\') ' +
                        'where owner_id = ? and period_id = ?;';
                    var params = [
                        user_id,
                        period_id
                    ];

                    db.queryParam(connection, sql, params, function (err) {
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
    deletePeriod: deletePeriod,
    createPeriod: createPeriod,
    getPeriodsByGroup: getPeriodsByGroup
};