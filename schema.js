/*
 * @name: schema.js
 * @description: FETest schema
 * @author: wondger@gmail.com
 * @date: 2012-09-19
 * @param: 
 * @todo: 
 * @changelog: 
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var
    /*
     * 问题
     */
    Question = new Schema({
        content: {
            "type": String,
            "required": true,
            "validate": /.+/
        },
        steps: {
            "type": Array,
            "required": false
        },
        level: {
            "type": Number,
            "required": true,
            "enmu": [4, 5, 6, 7, 8],
            "default": 1
        },
        skill: {
            "type": String,
            "required": true,
            "enmu": ["css", "javascript", "html", "mixed"],
            "default": "mixed"
        },
        /*
         * 1:选择题
         * 2:编码题
         * 0:默认
         */
        type: {
            "type": Number,
            "required": false,
            "enmu": [0, 1, 2],
            "default": 0
        },
        created: {
            "type": Date,
            "required": true
        },
        author: {
            "type": String,
            "default": ""
        },
        /*
         * 题目期望完成时间
         */
        time: {
            "type": Number,
            "required": true
        },
        /*
         * 题目分析，前台用户不可见，为评卷参考
         */
        remark: {
            "type": String
        },
        deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),
    /*
     * 答卷
     */
    Test = new Schema({
        email: {
            "type": String,
            "trim": true,
            "required": true,
            "validate": /[-\w\.]+@\w+(?:(?:\.\w+)+)$/
        },
        /*
         *[
         *    {
         *        _id: ObjectId,
         *        ret: String,
         *        score: Number,
         *        time: Number
         *    }
         *]
         */
        questions: {
            "type": Array
        },
        /*
         * 邮件发送数量，最多5次
         */
        emailed: {
            "type": Array
        },
        remark: {
            "type": String,
            "default": ""
        },
        sha1: {
            "type": String
        },
        visited: {
            "type": Array
        },
        finished: {
            "type": Boolean,
            "default": false
        },
        /*
         * 体量所需总时间
         */
        time: {
            "type": Number
        },
        score: {
            "type": Number
        }
    });
    /*
     * Quiz
     */
    Quiz = new Schema({
        author: {
            "type": String,
            "trim": true,
            "required": true
        },
        questions: {
            "type": Array
        },
        created: {
            "type": Date,
            "required": true
        },
    });

exports.Test = Test;
exports.Question = Question;
