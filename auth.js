/*
 * @name: auth.js
 * @description: 权限管理
 *      1.URL重发
 *      2.写操作
 * @author: yanmu.wj(wondger@gmail.com)
 * @date: 2012-09-24
 * @param: 
 * @todo: 
 * @changelog: 
 */
var util = require("./util");

var auth = {
    check: function(req, res) {
        if (!req.cookies._t_ && !req.body.name) {
            return false;
        }
        else if(req.cookies._t_ && req.cookies._t_.match(/^\w+$/i)) {
            var _t_ = JSON.parse(util.decrypt({data: req.cookies._t_}));

            if (_t_.name && _t_.date && _t_.ip && _t_.name === "tbued" && _t_.ip === req.connection.remoteAddress) {
                return true;
            }

            return false;
        }
        else if(req.body.name) {
            if (req.body.name === "tbued" && req.body.pwd === "taobao1234") {
                auth.cookie(req, res);
                return true;
            }
        }
        return false;
    },
    cookie: function(req, res) {
        var date = new Date().getTime(),
            ip = req.connection.remoteAddress,
            name = req.body.name;

        if (name) {
            res.cookie("_t_", util.encrypt({
                data: JSON.stringify({
                    date: date,
                    ip: ip,
                    name: name
                })
            }));
        }
    }
};

module.exports = auth;
