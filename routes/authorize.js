/*
 * @name: authorize.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-01
 * @param: 
 * @todo: 
 * @changelog: 
 */

var DB = require("../db")
    _ = require("underscore");

module.exports = exports = {
    render: function(req, res) {
        DB.User.get({
            deleted: false,
            type: {
                $in: ["root", "administrator"]
            }
        }, function(d){
            if (!d || !d.success) {
                res.send("DB error.");
                return;
            }

            d.docs.forEach(function(user, index) {
                d.docs[index] = {
                    loginName: user.loginName,
                    nick: user.nick,
                    type: user.type
                };
            });

            res.render("authorize", {
                title: "申请权限",
                reviewers: JSON.stringify(d.docs)
            });
        });
    }
};
