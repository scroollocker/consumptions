var express = require('express');
var router = express.Router();
var Validator = require('better-validator');
var groups = require('../modules/models/groups');
var xss = require('xss');

const validator = new Validator();

router.get('/byUser/:userId', function (req, res, next) {
    var params = {
        userId: parseInt(req.params.userId)
    };
    // console.log(params);
    validator(params).required().isObject(function(child) {
        child('userId').required().isNumber().integer().isPositive();
    });

    const errors = validator.run();

    if (errors.length > 0) {
        console.log(errors);
        res.send({
            status: false,
            message: 'Неверные параметры запроса'
        });
    }
    else {
        var userId = req.params.userId;
        groups.getGroupsByUserId(userId, function (err, results) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Произошла ошибка получения данных'
                });
            }
            else {
                res.send({
                    status: true,
                    groups: results
                });
            }
        });
    }

});

router.post('/addUser/:groupId', function (req, res, next) {
    var params = {
        groupId: parseInt(req.params.groupId),
        userId: parseInt(req.body.userId)
    };

    validator(params).required().isObject(function (child) {
        child('groupId').isNumber().integer().isPositive();
        child('userId').isNumber().integer().isPositive();
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Неверные параметры запроса'
        });
    }
    else {
        groups.addUserToGroup(params.groupId, params.userId, function (err) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Ошибка при обработке запроса'
                });
            }
            else {
                res.send({
                    status: true,
                    message: 'Данные успешно добавлены'
                });
            }
        })
    }
});

router.post('/create', function (req, res, next) {
    var params = {
        name: xss(req.body.group_name),
        userId: parseInt(req.body.user_id)
    };

    validator(params).required().isObject(function (child) {
        child('name').isString();
        child('userId').isNumber().isPositive();
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка в параметрах запроса'
        });
    }
    else {
        groups.createGroup(params.name, params.userId, function (err) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Ошибка при обработке запроса'
                });
            }
            else {
                res.send({
                    status: true,
                    message: 'Успешно создана'
                });
            }
        });
    }
});

router.post('/delete', function (req, res, next) {
    var params = {
        group_id: parseInt(req.body.group_id),
        user_id: parseInt(req.body.user_id)
    };

    validator(params).required().isObject(function (child) {
        child('group_id').isNumber().integer().isPositive();
        child('user_id').isNumber().integer().isPositive();
    });

    var error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка в параметрах запроса'
        });
    }
    else {
        groups.deleteGroup(params.user_id, params.group_id, function (err) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Ошибка обработки запроса'
                });
            }
            else {
                res.send({
                    status: true,
                    message: 'Успешно удалена'
                });
            }
        });
    }
});

router.get('/usersByGroup/:groupId', function (req, res, next) {
    var params = {
        group_id: parseInt(req.params.groupId)
    };

    validator(params).required().isObject(function (child) {
        child('group_id').isNumber().integer().isPositive();
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка в параметрах запроса'
        });
    }
    else {
        groups.getUsersInGroup(params.group_id, function (err, result) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Ошибка обработки запроса'
                });
            }
            else {
                res.send({
                    status: true,
                    users: result
                });
            }
        });
    }
});

router.post('/deleteUserFrom/:groupId', function (req, res, next) {
    var params = {
        group_id: parseInt(req.params.groupId),
        user_id: parseInt(req.body.user_id)
    };

    validator(params).required().isObject(function (child) {
        child('group_id').isNumber().integer().isPositive();
        child('user_id').isNumber().integer().isPositive();
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка в параметрах запроса'
        });
    }
    else {
        groups.deleteUserFromGroup(params.user_id, params.group_id, function (err) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Ошибка обработки запроса'
                });
            }
            else {
                res.send({
                    status: true,
                    message: 'Пользователь удален'
                });
            }
        });
    }
});

router.get('/byId/:groupId/:userId', function (req, res, next) {
    var params = {
        groupId: parseInt(req.params.groupId),
        userId: parseInt(req.params.userId)
    };
    // console.log(params);
    validator(params).required().isObject(function(child) {
        child('userId').required().isNumber().integer().isPositive();
        child('groupId').required().isNumber().integer().isPositive();
    });

    const errors = validator.run();

    if (errors.length > 0) {
        console.log(errors);
        res.send({
            status: false,
            message: 'Неверные параметры запроса'
        });
    }
    else {
        var userId = req.params.userId;
        var groupId = req.params.groupId;
        groups.getGroupById(groupId, userId, function (err, results) {
            if (err) {
                console.log(err);
                res.send({
                    status: false,
                    message: 'Произошла ошибка получения данных'
                });
            }
            else {
                if (results && results.length > 0) {
                    res.send({
                        status: true,
                        group: results[0]
                    });
                }
                else {
                    res.send({
                        status: false,
                        message: 'Произошла ошибка получения данных'
                    });
                }
            }
        });
    }
});


module.exports = router;