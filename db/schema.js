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

module.exports = {
    /*
     * 问题
     */
    question: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
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
         * 1: 选择题
         * 2: 编码题
         * 3: 开放题
         * 0: 默认
         */
        type: {
            "type": Number,
            "required": false,
            "enmu": [0, 1, 2, 3],
            "default": 0
        },
        created: {
            "type": Date,
            "required": true
        },
        // 来源
        from: {
            "type": String,
            "default": ""
        },
        // 对应user的loginName
        author: {
            "type": String,
            "default": ""
        },
        // 对应user的nickNameCn / loginName
        authorNick: {
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
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),

    /*
     * Quiz
     */
    quiz: new Schema({
        id: {
            "type": Number,
            "default": -1,
            "required": true,
            "validate": /\d+/
        },
        author: {
            "type": String,
            "trim": true,
            "default": "",
            "required": true
        },
        created: {
            "type": Date,
            "required": true
        },
        questions: {
            "type": Array,
            "required": true
        },
        answers: {
            "type": Array,
            "required": true
        },

        /*
         * email存在：在线测试版
         *    不存在：打印版
         */
        email: {
            "type": String,
            "trim": true,
            "required": false,
            "validate": /[-\w\.]+@\w+(?:(?:\.\w+)+)$/
        },

        /*
         * email发送次数
         */
        emailed: {
            "type": Array
        },

        /*
         * 访问次数
         */
        visited: {
            "type": Array
        },

        /*
         * 完成时间
         */
        finished: {
            "type": Date
        },

        /*
         * 题量时间
         */
        time: {
            "type": Number,
            "required": true
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    }),


    /*
     * User
     */
    user: new Schema({
        loginName: {
            "type": String,
            "trim": true,
            "required": true
        },
        /*
         * 权限
         * guest 无任何权限
         * member 普通用户，添加、编辑、删除自己题目
         * administrator 管理员，添加、编辑、删除任何题目权限
         * root 题目操作权限+授权权限
         */
        type: {
            "type": String,
            "required": true,
            "enmu": ["guest", "member", "administrator", "root"],
            "default": "guest"
        },
        nick: {
            "type": String,
            "trim": true,
            "required": false
        },
        email: {
            "type": String,
            "trim": true,
            "required": true,
            "validate": /[-\w\.]+@\w+(?:(?:\.\w+)+)$/
        },
        _deleted: {
            "type": Boolean,
            "default": false,
            "required": true
        }
    })
};
