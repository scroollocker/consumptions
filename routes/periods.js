var express = require('express');
var router = express.Router();
var Validator = require('better-validator');
var periods = require('../modules/models/periods');

const validator = new Validator();

router.get('/byGroup/:groupId/:userId', function (req, res, next) {
    var params = {
        group_id: parseInt(req.params.groupId),
        user_id: parseInt(req.params.userId)
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
            message: 'Ошибка неверные параметры запроса'
        });
    }
    else {
        periods.getPeriodsByGroup(params.user_id, params.group_id, function (err, results) {
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
                    periods: results
                });
            }
        });
    }
});

router.post('/create', function (req, res, next) {
    var params = {
        group_id: parseInt(req.body.groupId),
        user_id: parseInt(req.body.userId),
        date_start: req.body.date_start,
        date_end: req.body.date_end,
        sum: req.body.sum
    };

    validator(params).required().isObject(function (child) {
        child('group_id').isNumber().integer().isPositive();
        child('user_id').isNumber().integer().isPositive();
        child('sum').isNumber().integer().isPositive();
        child('date_start').isString().isDate().isBefore(params.date_end);
        child('date_start').isString().isDate().isAfter(params.date_start);
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка неверные параметры запроса'
        });
    }
    else {
        periods.createPeriod(params.user_id, params.group_id, params.date_start, params.date_end, params.sum, function (err) {
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
                    message: 'Успешно создано'
                });
            }
        });
    }
});

router.post('/delete', function (req, res, next) {
    var params = {
        period_id: parseInt(req.body.period_id),
        user_id: parseInt(req.body.user_id)
    };

    validator(params).required().isObject(function (child) {
        child('period_id').isNumber().integer().isPositive();
        child('user_id').isNumber().integer().isPositive();
    });

    const error = validator.run();

    if (error.length > 0) {
        console.log(error);
        res.send({
            status: false,
            message: 'Ошибка неверные параметры запроса'
        });
    }
    else {
        periods.deletePeriod(params.user_id, params.period_id, function (err) {
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
                    message: 'Успешно удалено'
                });
            }
        });
    }
});

module.exports = router;