var db = require('../database');

var getGroupsByUserId = function (id, callback) {
    if (callback && typeof callback === 'function') {
        if (id && id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'SELECT ga.group_id, ga.user_id, g.name FROM groups_user AS ga ' +
                        'INNER JOIN groups AS g ON ga.group_id = g.groups_id ' +
                        'WHERE ga.user_id = ?;';

                    var params = [
                        id
                    ];

                    db.queryParam(connection, sql, params, callback);
                }
            })
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var getUsersInGroup = function (group_id, callback) {
    if (callback && typeof callback === 'function') {
        if (group_id && group_id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'SELECT ga.group_id, u.id, u.username FROM groups_user AS ga ' +
                        'INNER JOIN groups AS g ON ga.group_id = g.groups_id ' +
                        'INNER JOIN users AS u ON u.id = ga.user_id ' +
                        'WHERE ga.group_id = ?;';

                    var params = [
                        group_id
                    ];

                    db.queryParam(connection, sql, params, callback);
                }
            })
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var createGroup = function (name, user_id, callback) {
    if (callback && typeof callback === 'function') {
        if (name && name.length > 0 && user_id && user_id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    connection.beginTransaction(err, function () {
                        if (err) {
                            callback(err);
                            return;
                        }

                        var sql = 'insert into groups(name) values(?);';
                        var prams = [
                            name
                        ];
                        // var insertId = undefined;
                        db.queryParam(connection, sql, prams, function (err, results) {
                            if (err) {
                                connection.rollback(function (err) {
                                    console.log(err);
                                });
                                callback(err);
                                return;
                            }
                            sql = 'insert into groups_user(group_id, user_id) values(?, ?);';
                            prams = [
                                results.insertId,
                                user_id
                            ];
                            db.queryParam(connection, sql, prams, function (err) {
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
                                    })
                                }
                            });

                        });
                    });
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var addUserToGroup = function (group_id, user_id, callback) {
    var self = this;
    if (callback && typeof callback === 'function' && user_id && user_id !== 0) {
        if (user_id && user_id !== 0 && group_id && group_id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    self.getGroupsByUserId(user_id, function (err, result, fields) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var found = false;
                        if (result.length > 0) {
                            result.forEach(function (value) {
                                if (value.group_id === group_id) {
                                    found = true;
                                }
                            });
                            if (found) {
                                var sql = 'insert into groups_user(group_id, user_id) values(?, ?);';
                                var params = [
                                    group_id,
                                    user_id
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
                        }
                        else {
                            callback(new Error('Groups for user not found'));
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

var deleteGroup = function (user_id, group_id, callback) {
    var self = this;
    if (callback && typeof callback === 'function' && user_id && user_id !== 0) {
        if (user_id && user_id !== 0 && group_id && group_id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    self.getGroupsByUserId(user_id, function (err, result, fields) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        var found = false;
                        if (result.length > 0) {
                            result.forEach(function (value) {
                                if (value.group_id === group_id) {
                                    found = true;
                                }
                            });
                            if (found) {
                                connection.beginTransaction(function (err) {
                                    if (err) {
                                        callback(err);
                                        return;
                                    }
                                    var sql = 'delete from groups where groups_id = ?;';
                                    var params = [
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
                                            sql = 'delete from groups_user where group_id = ?;';
                                            params = [
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
                                                    })
                                                }
                                            });
                                        }
                                    });

                                });

                            }
                        }
                        else {
                            callback(new Error('Groups for user not found'));
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

var deleteUserFromGroup = function (user_id, group_id, callback) {

    if (callback && typeof callback === 'function' && user_id && user_id !== 0) {
        if (user_id && user_id !== 0 && group_id && group_id !== 0) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = "delete from groups_user where group_id = ? and user_id = ?;";

                    var params = [
                        group_id,
                        user_id
                    ];

                    db.queryParam(connection, sql, params, function (err) {
                        if (err) {
                            callback(err);
                        }
                        else {
                            callback(null);
                        }
                    })
                }
            });
        }
        else {
            callback(new Error('Params error'));
        }
    }
};

var getGroupsById = function (group_id, user_id, callback) {
    if (callback && typeof callback === 'function') {
        if (group_id && user_id) {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'SELECT ga.group_id, ga.user_id, g.name FROM groups_user AS ga ' +
                        'INNER JOIN groups AS g ON ga.group_id = g.groups_id ' +
                        'WHERE ga.user_id = ? and ga.group_id = ? limit 1;';

                    var params = [
                        user_id, group_id
                    ];

                    db.queryParam(connection, sql, params, callback);
                }
            })
        }
    }
    else {
        callback(new Error('Params error'));
    }
};

module.exports = {
    getGroupsByUserId: getGroupsByUserId,
    addUserToGroup: addUserToGroup,
    createGroup: createGroup,
    getUsersInGroup: getUsersInGroup,
    deleteUserFromGroup: deleteUserFromGroup,
    deleteGroup: deleteGroup,
    getGroupById: getGroupsById
};
