var express = require('express');
var router = express.Router();
var db = require('../modules/database');
var User = require('../modules/models/users');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function (req, res, next) {
    db.openConnection(function (err, connection) {
        if (err) {
            res.send('Произошла ошибка соединения с БД');
        }
        else {
          db.query(connection,'select * from users', function (err, result, fields) {
             if (err) {
                 res.send('Произошла ошибка работы с БД');
             }
             else {
               console.log(result);
               console.log(fields);
               res.send({result : result});
             }
          });
        }
    });
});

router.get('/test2', function (req, res, next) {
    var user = new User();

    var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash("123", salt, function(err, hash) {
            var r = {
                id: 0,
                username: 'akhaylov',
                password: hash,
                isAdmin: 0,
                createDate: new Date(),
                expDate: null
            };

            user.set(r);
            user.create(function (err) {
                console.log(err);
            });
        });
    });




});

router.get('/test3', function (req, res, next) {
    var user = new User();

    user.set({
        username: 'akhaylov',
        password: '123'
    });

    user.auth(function (err) {
        if (err) {
            console.log(err);
            res.send({
                status: false,
                message: 'Ошибка авторизации'
            });
        }
        else {
            res.send({
                status: true,
                user: user.get()
            })
        }
    });

});




module.exports = router;
