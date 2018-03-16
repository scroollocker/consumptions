var tokens = require('../modules/tokens');

module.exports = function (req, res, next) {
    var token = req.body.token;
    if (!token) {
        token = req.query.token;
    }

    if (token && token.length > 0) {
        tokens.verifyToken(token, function (err, decoded) {
            if (err) {
                res.status(401);
                res.send({
                    status: false,
                    message: 'Need authorize'
                });
            }
            else {
                req.raw_token = token;
                req.decoded_token = decoded;
                next();
            }
        });
    }
    else {
        res.status(401);
        res.send({
            status: false,
            message: 'Need authorize'
        });
    }
};
