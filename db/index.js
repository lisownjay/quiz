/*
 * @name: .js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-27
 * @param: 
 * @todo: 
 * @changelog: 
 */

var mongoose = require("mongoose"),
    _ = require("underscore"),
    schema = require("./schema"),
    DB_NAME = "fetest";

mongoose.connect("mongodb://localhost/" + DB_NAME);

module.exports = db = {
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

       Mod.count(function(err, count) {
           if (err) {
               complete(err, doc);
               return;
           }

           doc.id = count + 1;

           new Mod(doc).save(function(err, doc) {
               complete(err, doc);
           });
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

       query._deleted = false;
       doc._deleted = !!opt.del;

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
           options = _.isObject(opt.options) ? opt.options : {},
           collection = _.isString(opt.collection) ? opt.collection : "",
           complete = _.isFunction(opt.complete) ? opt.complete : function(){};

       if (!collection || !schema[collection]) {
           complete(new Error("Param error"));
           return;
       }

       var mod = mongoose.model(collection, schema[collection], collection);

       query._deleted = false;
       options["sort"] = options["sort"] || {};

       mod.find(query, null, options, function(err, docs) {
           complete(err, docs);
       });
    }
};
