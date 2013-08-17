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
    //岗位描述信息
    "station":[
        {"id": 1, "description": "前端开发工程师"}
        ,{"id": 2, "description": "交互设计师"}
    ],
    //岗位的配置信息，skill代表分类，questionType代表题型，level代表难度(必须是数字),marker阅卷人(同时也是该岗位授权登录后台的用户)
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
            ],
            "marker":[
                "容景","风驰","舒文"
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
            ],
            "marker":[
                "容景","风驰","舒文"
            ]
        }
    ]
};

module.exports = exports = {
    //判断是否是授权用户
    has: function(nick) {
        return data.stationSetting.some(function(item){
           return item.marker.join().indexOf(nick) >= 0;
        });
    },
    //取得岗位信息
    getStation: function(id){
        //ID(数字)
        if(!isNaN(Number(id))){
            for(var i=0; i < data.station.length; ++i){
                if(data.station[i].id == id){
                    return data.station[i];
                }
            }
        }
        //nick（昵称）
        else{
            for(var i=0; i< data.stationSetting.length; ++i){
                if(data.stationSetting[i].marker.join().indexOf(id) >= 0){
                    return arguments.callee.call(this,data.stationSetting[i].stationId);
                }
            }
        }
    },
    //取得岗位配置信息
    getStationSetting: function(id){
        for(var i=0; i < data.stationSetting.length; ++i){
            if(data.stationSetting[i].stationId == id){
                return data.stationSetting[i];
            }
        }
    },
    //根据岗位分配下一个阅卷人
    getNextMarker: function(stationId){
        var nextMarker;
        var setting = exports.getStationSetting(stationId);
        if(setting){
            var markers = setting.marker;
            //使用global存放所有岗位下一个将要分配的阅卷人,这样在程序运行期间都能够访问到
            if(!global.nextMarkers){

                global.nextMarkers = [];
                for(var i=0; i < data.stationSetting.length; ++i){
                    var item = {};
                    item.stationId = data.stationSetting[i].id;
                    item.marker = data.stationSetting[i].marker[0] || "";
                    global.nextMarkers.push(item);
                }
            }

            for(var i=0; i<global.nextMarkers.length; ++i){
                if(global.nextMarkers[i].stationId == stationId){
                    nextMarker = global.nextMarkers[i].marker;

                    //分配下一次的阅卷人，存放在global中
                    var index = markers.indexOf(nextMarker);
                    index = index == -1 ? 0 : (index == markers.length-1 ? 0 : index + 1);
                    global.nextMarkers[i].marker=markers[index];

                    return nextMarker;
                }
            }
        }
        return "";
    }
};
