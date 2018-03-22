var express = require('express');
var router = express.Router();
var User = require('../modules/models/users');
var tokens = require('../modules/tokens');
var config = require('../configs');
var bcrypt = require('bcryptjs');
var xss = require('xss');

router.post('/register', function(req, res, next) {

    var username = xss(req.body.username);
    var password = req.body.password;

    try {

        if (username !== null && username !== undefined && username.length > 0) {
            if (password !== null && password !== undefined && password.length > 0) {

                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        if (err) {
                            res.send({
                                status: false,
                                message: 'Во время регистрации произошла ошибка. Попробуйте позднее.'
                            });
                            return;
                        }

                        var user = new User();
                        user.set({
                            username: username,
                            password: hash,
                            isAdmin: 0,
                            createDate: new Date()
                        });
                        user.create(function (err) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    status: false,
                                    message: 'Во время регистрации произошла ошибка. Попробуйте позднее.'
                                });
                            }
                            else {
                                var userAuth = user.get();
                                var payload = {
                                    user_id: userAuth.id,
                                    username: userAuth.username,
                                    isAdmin: userAuth.isAdmin
                                };
                                tokens.createToken(payload, function (err, token) {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            status: false,
                                            message: 'Во время выдачи токена произошла ошибка. Попробуйте авторизоваться.'
                                        });
                                    }
                                    else {
                                        res.send({
                                            status: true,
                                            token: token,
                                            expDate: Math.floor(new Date().getTime() / 1000) + config.token_livetime
                                        });
                                    }
                                });
                            }
                        });
                    });
                });


            }
            else {
                throw new Error('Неверный пароль');
            }
        }
        else {
            throw new Error('Неверный пароль');
        }
    }
    catch (err) {
        console.log(err);
        res.send({
            status: false,
            message: err.message
        });
    }

});

router.post('/auth', function (req, res, next) {
    var username = xss(req.body.username);
    var password = req.body.password;
    try {
        if (username && username.length > 0) {
            if (password && password.length > 0) {
                var user = new User();
                user.set({
                    username: username,
                    password: password
                });
                user.auth(function (err, user) {
                    if (err) {
                      res.send({
                          status: false,
                          message: 'Ошибка авторизации. Неверный логин или пароль'
                      });
                    }
                    else {
                        var payload = {
                            user_id: user.id,
                            username: user.username,
                            isAdmin: user.isAdmin
                        };
                        tokens.createToken(payload, function (err, token) {
                            if (err) {
                                console.log(err);
                                res.send({
                                    status: false,
                                    message: 'Во время выдачи токена произошла ошибка. Попробуйте авторизоваться позднее.'
                                });
                            }
                            else {
                                res.send({
                                    status: true,
                                    token: token,
                                    expDate: Math.floor(new Date().getTime() / 1000) + config.token_livetime
                                });
                            }
                        });
                    }
                });
            }
            else {
              throw new Error('Неверный пароль');
            }
        }
        else {
            throw new Error('Неверный логин');
        }
    }
    catch (err) {
      res.send({
          status: false,
          message: err.message
      });
    }
});

module.exports = router;
