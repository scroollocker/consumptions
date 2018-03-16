var jwt = require('jsonwebtoken');
var config = require('../configs');

var createToken = function (payload, callback) {
    if (callback !== null && callback !== undefined && typeof callback === 'function') {
        jwt.sign(payload, config.app_secret, { expiresIn: config.token_livetime }, callback);
    }
};

var verifyToken = function (token, callback) {
    if (callback !== null && callback !== undefined && typeof callback === 'function') {
        jwt.verify(token, config.app_secret, callback);
    }
};

module.exports = {
    createToken: createToken,
    verifyToken: verifyToken
};