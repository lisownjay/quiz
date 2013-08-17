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
    //出题人
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
    //岗位描述信息
    "station":[
        {"id": 1, "description": "前端开发工程师"}
        ,{"id": 2, "description": "交互设计师"}
    ],
    //岗位的配置信息，types代表分类，questionType代表题型，level代表难度(必须是数字)
    "stationSetting":[
        {"id":1, "stationId":1,
            "skill":[
                {"name":"javascript", description:"JavaScript"}
                ,{"name":"html", description:"HTML"}
                ,{"name":"css", description:"CSS"}
            ],
            "questionType":[
                {"name":"choice", description:"选择题"}
                ,{"name":"code", description:"编程题"}
                ,{"name":"open", description:"开发题"}
                ,{"name":"default", description:"综合题"}
            ],
            "level":[
                4,5,6,7,8
            ]
        }

        ,{"id":2, "stationId":2,
            "skill":[
                {"name":"normal", description:"常识"},
                {"name":"design", description:"设计"}
            ],
            "questionType":[
                {"name":"choice", description:"选择题"}
                , {"name":"open", description:"开放题"}
                , {"name":"design", description:"设计题"}
        ],
            "level":[
                4,5,6,7
            ]
        }
    ]
};

module.exports = {
    has: function(nick) {
        return data.campus2013.some(function(user, index, arr) {
            return user.nick === nick;
        });
    },
    getStation: function(id){
        for(var i=0; i < data.station.length; ++i){
            if(data.station[i].id == id){
                return data.station[i];
            }
        }
    },
    getStationSetting: function(id){
        for(var i=0; i < data.stationSetting.length; ++i){
            if(data.stationSetting[i].stationId == id){
                return data.stationSetting[i];
            }
        }
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
