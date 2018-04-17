var db = require('../database');
var bcrypt = require('bcryptjs');

function User() {
    this.user = {};
    this.user.id = 0;
    this.user.username = '';
    this.user.password = '';
    this.user.isAdmin = 0;
    this.user.createDate = null;
    this.user.expDate = null;
    this.user.isBlocked = 0
}

User.prototype.set = function (user) {
    this.user.id = user.id;
    this.user.username = user.username;
    this.user.password = user.password;
    this.user.isAdmin = user.isAdmin;
    this.user.createDate = user.createDate;
    this.user.expDate = user.expDate;
};

User.prototype.get = function () {
    return this.user;
};

User.prototype.create = function (callback) {
    var self = this;
    if (callback !== null && callback !== undefined && typeof callback === 'function') {
        self.getByUsername(self.user.username, function (err, user) {
            if (user) {
                callback(new Error('Пользователь уже существует'));
            }
            else {
                db.openConnection(function (err, connection) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        var sql = 'insert into users(`username`,`password`,`isAdmin`,`createDate`,`expDate`, `isBlocked`) ' +
                            'values (?, ?, ?, ?, ?, ?);';

                        var params = [
                            self.user.username,
                            self.user.password,
                            self.user.isAdmin,
                            self.user.createDate,
                            self.user.expDate,
                            self.user.isBlocked
                        ];

                        db.queryParam(connection, sql, params, function (err) {

                            if (err) {
                                db.closeConnection(connection, function (err) {
                                    console.log(err);
                                });
                                callback(err);
                            }
                            else {
                                //callback(null);
                                self.getByUsername(self.user.username, function (err, regUser) {
                                    self.user = regUser;
                                    db.closeConnection(connection, function (err) {
                                        console.log(err);
                                    });
                                    callback(null);
                                });
                            }
                        });
                    }
                });
            }
        });

    }
    else {
        callback(new Error('Params error'));
    }
};

User.prototype.update = function () {
    var self = this;
    if (this.user.id !== null && this.user.id !== undefined && this.user.id !== 0) {
        if (callback !== null && callback !== undefined && typeof callback === 'function') {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'update users set `username` = ?,`password` = ?,`isAdmin` = ?,' +
                        '`createDate` = ?,`expDate` = ?, `isBlocked` = ?) ' +
                        ' where `id` = ?;';

                    var params = [
                        self.user.username,
                        self.user.password,
                        self.user.isAdmin,
                        self.user.createDate,
                        self.user.expDate,
                        self.user.id,
                        self.user.isBlocked
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
    }
    else {
        callback(new Error('Params error'));
    }
};

User.prototype.getByUsername = function (username, callback) {
    if (username !== null && username !== undefined) {
        if (callback !== null && callback !== undefined && typeof callback === 'function') {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'select * from users where `username` = ?;';

                    var params = [
                        username
                    ];

                    db.queryParam(connection, sql, params, function (err, results, fields) {

                        if (err) {
                            callback(err);
                        }
                        else {
                            db.closeConnection(connection, function (err) {
                                console.log(err);
                            });
                            if (results.length > 0) {
                                var user = results[0];
                                callback(null, user);
                            }
                            else {
                                callback(new Error('User not found'));
                            }
                        }
                    });
                }
            });
        }
    }
};

User.prototype.delete = function () {
    if (this.user.id !== null && this.user.id !== undefined && this.user.id !== 0) {
        if (callback !== null && callback !== undefined && typeof callback === 'function') {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'delete from users ' +
                        ' where `id` = ?;';

                    var params = [
                        this.user.id
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
    }
    else {
        callback(new Error('Params error'));
    }
};

User.prototype.getById = function (id, callback) {
    var self = this;
    if (id !== null && id !== undefined && id !== 0) {
        if (callback !== null && callback !== undefined && typeof callback === 'function') {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'select * from users where `id` = ?;';

                    var params = [
                        id
                    ];

                    db.queryParam(connection, sql, params, function (err, res, fields) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        if (err) {
                            callback(err);
                        }
                        else {
                            if (res > 0) {
                                self.user = res[0];
                                callback(null, res[0]);
                            }
                            else {
                                callback(null, null);
                            }
                        }
                    });
                }
            });
        }
    }
    else {
        callback(new Error('Params error'));
    }
};

User.prototype.auth = function (callback) {
    var self = this;
    if (self.user.username !== null && self.user.username !== undefined && self.user.password !== null && self.user.password !== undefined) {
        if (callback !== null && callback !== undefined && typeof callback === 'function') {
            db.openConnection(function (err, connection) {
                if (err) {
                    callback(err);
                }
                else {
                    var sql = 'select * from users where `username` = ? and `isBlocked` = 0;';

                    var params = [
                        self.user.username
                    ];

                    db.queryParam(connection, sql, params, function (err, res, fields) {
                        db.closeConnection(connection, function (err) {
                            console.log(err);
                        });
                        if (err) {
                            callback(err);
                        }
                        else {
                            if (res.length > 0) {
                                var hash = res[0].password;

                                bcrypt.compare(self.user.password, hash, function(err, authRes) {
                                    if (authRes) {
                                        self.user = res[0];
                                        callback(null, self.user);
                                    }
                                    else {
                                        callback(new Error('User not authorize'))
                                    }
                                });

                            }
                            else {
                                callback(new Error('User not found'));
                            }
                        }
                    });
                }
            });
        }
    }
    else {
        callback(new Error('Params error'));
    }
};

module.exports = User;

