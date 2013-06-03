/*
 * @name: index.js
 * @description: 数据订正
 * @author: wondger@gmail.com
 * @date: 2013-06-03
 * @param: 
 * @todo: 
 * @changelog: 
 */

var mongoose = require("mongoose"),
    _ = require("underscore"),
    schema = require("./db/schema"),
    DB_NAME = "fetest";

mongoose.connect("mongodb://localhost/" + DB_NAME);

var db = {
    // create
    put: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var doc = _.isObject(opt.doc) ? opt.doc : null,
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!doc || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var Mod = mongoose.model(collection, schema[collection], collection);

       doc._deleted = false;
       delete doc._id;

       new Mod(doc).save(function(err, doc) {
           complete(err, doc);
       });

    },
    // update
    post: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           options = _.isObject(opt.options) ? opt.options : null,
           doc = _.isObject(opt.doc) ? opt.doc : null,
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!doc || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = mongoose.model(collection, schema[collection], collection);

       delete doc._id;

       mod.update(query, doc, options, function(err, numAffected) {
           complete(err, numAffected);
       });
    },
    // delete
    del: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!query || !collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }
       
       // set _deleted true
       query._deleted = true;

       this.post({
           query: query,
           collection: collection,
           options: {
               multi: true
           },
           doc: {
               _deleted: true
           },
           del: true,
           complete: complete
       });
    },
    // read
    get: function(opt) {
       opt = _.isObject(opt) ? opt : null;

       if (!opt) return;

       var query = _.isObject(opt.query) ? opt.query : {},
           fields = _.isObject(opt.fields) ? opt.fields : {},
           options = _.isObject(opt.options) ? opt.options : {},
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = mongoose.model(collection, schema[collection], collection);

       query._deleted = false;
       options["lean"] = _.isUndefined(options["lean"]) ? true : !!options["lean"];
       // all fileds setting must be use exclude by 0
       fields["__v"] = 0;

       mod.find(query, fields, options, function(err, docs) {
           complete(err, docs);
       });
    }
};


db.get({
    collection: "question",
    options: {
        sort: {created: -1}
    },
    complete: function(err, docs) {
        if (err) {
            console.log(err.message);
            return;
        }

        docs.forEach(function(doc, index) {
            doc.id = index + 1;
            var _id = doc._id;
            db.post({
                collection: "question",
                doc: doc,
                complete: function(err, numAffected) {
                    if (err) {
                        console.log(_id + " " + err.message);
                        return;
                    }

                    console.log(_id + " success.");
                }
            });
        });
    }
});
