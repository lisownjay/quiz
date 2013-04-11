/*
 * @name: p.js
 * @author: wondger@gmail.com
 * @description: 更新question.level
 * @date: 2012-07-08
 * @param:
 * @todo:
 * @changelog:
 */
/* update level
var DB = require("./db");

DB.Question.get({}, function(d){
    if (!d || !d.success || !d.docs || !d.docs.length) {
        console.log("error");
        return;
    }

    d.docs.forEach(function(q){
        q.level += 3;
        DB.Question.post({_id: q._id}, {level: q.level}, function(d){
            console.log(q._id + ": " + d.success);
        });
    });
});
*/
