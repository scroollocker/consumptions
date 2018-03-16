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

module.exports = {
    getGroupsByUserId: getGroupsByUserId
};
