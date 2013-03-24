/*
 * @name: email.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-21
 * @param: 
 * @todo: 
 * @changelog: 
 */
var http = require("http"),
    querystring = require("querystring");

module.exports = function(email, url, callback) {
    if (!email || !url) {
        callback({
            success: false
        });
        return;
    }

    var data = {
        subject: "淘宝UED欢迎您",
        content: '<h1>I Want You!</h1><h2>淘宝UED在寻找地球上最NB的前端开发工程师！</h2>欢迎您前来挑战，您的挑战地址是：<a href="' + url + '" target="_blank">' + url + '</a><br><br>请勿回复本邮件！',
    };

    var query = {
            source: "taobao_ued_fem",
            authKey: "B0D2F33DEC2BDC8613747D018AF8A1F0",
            templateKey: "aliway",
            to: email,
            from: "joinued@taobao.com",
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
        var c = "";
        res.on("data", function(chunk){
            c += chunk;
        });
        res.on("end", function(){
            //console.log(res);
            //console.log(c);
            callback({
                success: c.replace(/^\s+|\s+$/,'').toLowerCase() === "null"
            });
        });
    }).on("error", function(err){
        callback({
            success: false
        });
    }).end();

}
