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
        {"nick": "棪木", "stationId": 1}
        ,{"nick": "风驰", "stationId": 1}
        ,{"nick": "寒泉", "stationId": 1}
        ,{"nick": "舒文", "stationId": 1}
        ,{"nick": "阿大", "stationId": 1}
        ,{"nick": "玉伯", "stationId": 1}
        ,{"nick": "振宇", "stationId": 1}
        ,{"nick": "汉堡", "stationId": 1}
        ,{"nick": "石破", "stationId": 1}
        ,{"nick": "银鹏", "stationId": 1}
        ,{"nick": "李牧", "stationId": 1}
        ,{"nick": "影风", "stationId": 1}
        ,{"nick": "额台", "stationId": 1}
        ,{"nick": "正邪", "stationId": 1}
        ,{"nick": "蓝枫", "stationId": 1}
        ,{"nick": "影观", "stationId": 2}
        ,{"nick": "容景", "stationId": 1}
    ],
    "station":[
        {"id": 1, "description": "前端开发工程师"}
        ,{"id": 2, "description": "交互设计师"}
    ]
};

module.exports = {
    has: function(nick) {
        return data.campus2013.some(function(user, index, arr) {
            return user.nick === nick;
        });
    },
    getUserStation: function(nick){
        return data.campus2013.forEach(function(item){
            if(item.nick === nick)
                return item;
        });
    },
    station: function(user){
        var result;
        if(typeof user === "string"){
            data.campus2013.forEach(function(item){
                if(item.nick === user)
                    user = item;
            });
        }
        data.station.forEach(function(item){
            if(item.id === user.stationId){
                result = item;
            }
        });
        return result;
    }
};
