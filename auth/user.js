/*
 * @name: user.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-01
 * @param: 
 * @todo: 
 * @changelog: 
 */
var db = require("../db");

module.exports = exports = function(filter) {

    filter = Object.prototype.toString.call(filter) === "[object RegExp]" ? filter : /.*/;

    return function(req, res, next) {
        if (!filter.test(req.url)) {
            next();
            return;
        }

        if (req.user && req.user.nick && req.user.type) {
            next();
            return;
        }

        if (req._user && req._user.loginName) {
            db.get({
                collection: "user",
                query: {
                    loginName: req._user.loginName,
                },
                complete: function(err, docs) {
                    if (err) {
                        res.send(err.message);
                        return;
                    }

                    if (docs.length) {
                        req.user = {
                            loginName: docs[0].loginName,
                            nick: docs[0].nick || "",
                            email: docs[0].email || "",
                            type: docs[0].type
                        };

                        /*
                         *if (req.user.type === "guest") {
                         *    res.redirect("/authorize");
                         *    return;
                         *}
                         */

                        next();
                    }
                    else {
                        db.put({
                            collection: "user",
                            doc: {
                                loginName: req._user.loginName,
                                email: req._user.emailAddr,
                                nick: req._user.nickNameCn || ""
                            }
                        }, function(err, doc) {
                            if (err) {
                                res.send(err.message);
                                return;
                            }

                            next();
                        });

                        //res.redirect("/authorize");
                    }
                }

            });
        }
    }
};
