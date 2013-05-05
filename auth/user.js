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
            db.User.get({
                loginName: req._user.loginName,
                deleted: false
            }, function(d) {
                if (!d.success) {
                    res.send("DB error " + d.message);
                    return;
                }

                if (d.docs.length) {
                    req.user = {
                        loginName: d.docs[0].loginName,
                        nick: d.docs[0].nick || "",
                        email: d.docs[0].email || "",
                        type: d.docs[0].type
                    };

                    if (req.user.type === "guest") {
                        res.redirect("/authorize");
                        return;
                    }

                    next();
                }
                else {
                    db.User.put({
                        loginName: req._user.loginName,
                        email: req._user.emailAddr,
                        nick: req._user.nickNameCn || ""
                    }, function(d) {
                        console.log(d)
                    });

                    res.redirect("/authorize");
                }

            });
        }
    }
};
