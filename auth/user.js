/*
 * @name: user.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-01
 * @param: 
 * @todo: 
 * @changelog: 
 */
var db = require("../db"),
    data = require("../db/data");

module.exports = exports = function(filter) {

    filter = Object.prototype.toString.call(filter) === "[object RegExp]" ? filter : /.*/;

    return function(req, res, next) {
        if (!filter.test(req.url)) {
            next();
            return;
        }

        if (req.user && req.user.nick && req.user.type) {
            if (!data.has(req.user.nick)) {
                res.send(403);
                return;
            }
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

                        if (data.has(req.user.nick)) {
                            next();
                        }
                        else {
                            res.send(403);
                        }

                    }
                    else {
                        db.put({
                            collection: "user",
                            doc: {
                                loginName: req._user.loginName,
                                email: req._user.emailAddr,
                                nick: req._user.nickNameCn || ""
                            },
                            complete: function(err, doc) {
                                if (err) {
                                    res.send(err.message);
                                    return;
                                }

                                if (data.has(doc.nick)) {
                                    next();
                                }
                                else {
                                    res.send(403);
                                }
                            }
                        });

                        //res.redirect("/authorize");
                    }
                }

            });
        }
    }
};
