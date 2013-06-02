/*
 * @name: index.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-21
 * @param: 
 * @todo: 
 * @changelog: 
 */
var http = require("http"),
    _ = require("underscore"),
    querystring = require("querystring");

module.exports = exports = function(options) {
    options = options || {};
    options.complete = _.isFunction(options.complete) ? options.complete : function(){};

    if (!options.email || !options.url) {
        options.complete({
            success: false,
            message: "Param error"
        });
        return;
    }

    var data = {
        subject: "淘宝UED欢迎您",
        content: '<h1>I Want You!</h1><h2>淘宝UED在寻找地球上最NB的前端开发工程师！</h2>欢迎您前来挑战，您的挑战地址是：<a href="' + options.url + '" target="_blank">' + options.url + '</a><br><br>请勿回复本邮件！',
    };

    var query = {
            source: "taobao_ued_fem",
            authKey: "B0D2F33DEC2BDC8613747D018AF8A1F0",
            templateKey: "aliway",
            to: options.email,
            from: "淘宝UED<joinued@taobao.com>",
            parameters: "null",
            way: 3
        };

    data = encodeURIComponent(JSON.stringify(data));

    //console.log("http://sc.wf.taobao.org/Taobao.Facades.INotifyService/Notify?data=" + data + "&" + querystring.stringify(query));

    http.request({
        host: "sc.wf.taobao.org",
        path: "/Taobao.Facades.INotifyService/Notify?data=" + data + "&" + querystring.stringify(query),
        method: "get"
    }, function(res){

        var d = "";
        res.on("data", function(chunk){
            d += chunk;
        });
        res.on("end", function(){
            options.complete({
                success: d.replace(/^\s+|\s+$/,'').toLowerCase() === "null"
            });
        });

    }).on("error", function(err){
        options.complete({
            success: false,
            message: err.message
        });

    }).end();

}
