/*
 * @name: data.js
 * @description: 静态数据配置文件
 * @author: wondger@gmail.com
 * @date: 2013-08-15
 * @param: 
 * @todo: 
 * @changelog: 
 */

var data = {
    "campus2013": [
        {"nick": "棪木"}
        ,{"nick": "风驰"}
        ,{"nick": "寒泉"}
        ,{"nick": "舒文"}
        ,{"nick": "阿大"}
        ,{"nick": "玉伯"}
        ,{"nick": "振宇"}
        ,{"nick": "汉堡"}
        ,{"nick": "石破"}
        ,{"nick": "银鹏"}
        ,{"nick": "李牧"}
        ,{"nick": "影风"}
        ,{"nick": "额台"}
        ,{"nick": "正邪"}
        ,{"nick": "蓝枫"}
    ]
};

module.exports = {
    has: function(nick) {
        return data.campus2013.some(function(user, index, arr) {
            return user.nick === nick;
        });
    }
};
