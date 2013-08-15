/*
 * @name: util.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-25
 * @param: 
 * @todo: 
 * @changelog: 
 */
var crypto = require('crypto'),
    _ = require("underscore"),
    DB = require("./db"),
    Email = require("./email");

var config = {
        method: 'aes-128-cbc',
        /*
         *不同算法对key,iv长度有要求
         */
        key: 'tbuedfetest@2012',
        iv: '@ued@taobao@2012',
        input_encoding: 'utf8',
        output_encoding: 'hex',
        hash_method: 'sha1',
        hash_input_encoding: 'utf8',
        hash_output_encoding: 'hex',
        /*
         * token过期时间1小时
         */
        timeout: 240 * 60 * 60 * 1000
    };

var util = {
    sendURL: function(email, host, callback) {
        DB.Test.get({
            email: email
        }, function(d){
            if (d && d.success && d.docs.length) {
                var l = d.docs[0].emailed.length,
                    clear = l && (now - d.docs[0].emailed[0]) > 24 * 60 * 60000 ? true : false,
                    now = new Date(),
                    pushData;

                /*
                 *清空记录
                 */
                if (clear) {
                    pushData = {$pushAll: {emailed: [now]}};
                }
                /*
                 *未到上限
                 */
                else if (l < 20){
                    pushData = {$push: {emailed: now}};
                }
                else {
                    callback({
                        success: false,
                        message: "TIMES LIMITED"
                    });
                    return;
                }

                //Email(email, "http://" + host + "/test/" + d.docs[0].sha1, function(d){
                Email(email, host + "/test.html?i=" + d.docs[0].sha1, function(d){
                    if (!d.success) {
                        callback({
                            success: false,
                            message: "TIMES LIMITED"
                        });
                        return;
                    }

                    DB.Test.post({
                        email: email
                    }, pushData, function(d){
                        callback({
                            success: d && d.success || false
                        });
                    });
                });
            }
            else {
                callback({
                    success: false,
                    message: "TIMES LIMITED"
                });
            }
        });
    },
    testSha1: function(data) {
        var data = data || null;
            method = "sha1",
            input_encoding = "utf8",
            output_encoding = "base64";

        if (data === null) {
            return data;
        }

        var shasum = crypto.createHash(method);

        shasum.update(data, input_encoding);

        return shasum.digest(output_encoding);
    },
    encrypt: function(cfg) {
        var cfg = cfg || {},
            data = _.isString(cfg.data) ? cfg.data : '',
            key = _.isString(cfg.key) && cfg.key.length === 16 ? cfg.key : config.key,
            iv = _.isString(cfg.iv) && cfg.iv.length === 16 ? cfg.iv : config.iv,
            input_encoding = _.isString(cfg.input_encoding) ? cfg.input_encoding : config.input_encoding,
            output_encoding = _.isString(cfg.output_encoding) ? cfg.output_encoding : config.output_encoding;

        var cipher = crypto.createCipheriv(config.method, key, iv),
            cipherChunks = [];

        cipherChunks.push(cipher.update(data, input_encoding, output_encoding));
        cipherChunks.push(cipher.final(output_encoding));

        return cipherChunks.join('');
    },
    decrypt: function(cfg) {
        var cfg = cfg || {},
            data = _.isString(cfg.data) ? cfg.data : '',
            key = _.isString(cfg.key) && cfg.key.length === 16 ? cfg.key : config.key,
            iv = _.isString(cfg.iv) && cfg.iv.length === 16 ? cfg.iv : config.iv,
            input_encoding = _.isString(cfg.input_encoding) ? cfg.input_encoding : config.output_encoding,
            output_encoding = _.isString(cfg.output_encoding) ? cfg.output_encoding : config.input_encoding;

        var decipher = crypto.createDecipheriv(config.method, key, iv),
            decipherChunks = [];

        decipherChunks.push(decipher.update(data, input_encoding, output_encoding));
        decipherChunks.push(decipher.final(output_encoding));

        return decipherChunks.join('');
    },
    escapeQuestion: function(question) {
        var imgRegExp = /[^!]{2}<\s*img\s+src=[^>]+\/>/g;
            img = question.match(imgRegExp),
            cursor = 0,
            content = _.escape(question.replace(imgRegExp, function(){
                return "{{" + (cursor++) + "}}";
            })).replace(/{{(\d)}}/g, function($0, $1){
                return img[parseInt($1, 10)];
            });

        return content.replace(/!!(&lt;\s*img\s+src=)/g, "$1");
    }
};

module.exports = util;
