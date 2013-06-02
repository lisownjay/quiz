/*
 * @name: .js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-06-02
 * @param: 
 * @todo: 
 * @changelog: 
 */
var db = require("./db");

db.get({
    collection: "question",
    options: {
        sort: {created: 1}
    },
    complete: function(err, docs) {
        if (err) {
            console.log(err.message);
            return;
        }

        docs.forEach(function(doc, index) {
            doc.id = index + 1;
            db.post({
                collection: "question",
                query: {_id: doc._id},
                doc: {
                    id: index + 1
                },
                complete: function(err, numAffected) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log("update " + doc._id + " success!");
                }
            });
        });
    }
});
