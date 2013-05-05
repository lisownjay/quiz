/*
 * @name:db.js
 * @description:CRUD implements
 * @author:wondger@gmail.com
 * @date:2012-07-08
 * @param:
 * @todo:
 * @changelog:
 */
var mongoose = require('mongoose'),
    _ = require('underscore'),
    schema = require('./schema'),
    testSchema = schema.Test,
    questionSchema = schema.Question,
    quizSchema = schema.Quiz,
    userSchema = schema.User,
    dbName = 'fetest';

var DB = {
        /*
         * create a document
         */
        put: function(collection, doc, callback) {
            var callback = _.isFunction(callback) ? callback : function(){};
            if(!_.isString(collection) || !_.isObject(doc) || _.isFunction(doc)){
                callback({
                    success: false,
                    message: "param error"
                });
                return false;
            }

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) {
                callback({
                    success: false,
                    message: "no collection"
                });
                return;
            }

            var Mod = config.connection.model(collection, config.schema, config.collection),
                mod = new Mod();

            var _doc = doc;

            _.extend(mod, doc);

            mod.save(function(err, doc){
                if (err) {
                    callback({
                        success: false,
                        message: err.message
                    });
                }
                else {
                    callback({
                        success: true,
                        _id: doc && doc._id || ""
                    });
                }
            });
        },
        /*
         * get documents
         */
        get: function(collection, query, options, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : (_.isFunction(options) ? options : function(){}),
                options = _.isFunction(options) ? {} : (_.isObject(options) ? options : {});

            var config = DB.config(collection);

            if(!config.collection || !config.schema) {
                callback({
                    success: false,
                    message: "no collection"
                });
                return;
            }

            var Mod = config.connection.model(config.collection, config.schema, config.collection);

            Mod.find(query, null, options, function(err, docs){
                if (err) {
                    callback({
                        success: false,
                        message: err.message
                    });
                }
                else {
                    callback({
                        success: true,
                        docs: docs
                    });
                }
            });
        },
        /*
         * modify document
         */
        post: function(collection, query, doc, callback) {
            if(!_.isString(collection) || !_.isObject(doc) || _.isFunction(doc)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) {
                callback({
                    success: false,
                    message: "no collection"
                });
                return;
            }

            var Mod = config.connection.model(collection, config.schema, config.collection);

            Mod.update(query, doc, function(err, numAffected){
                if (err) {
                    callback({
                        success: false,
                        message: err.message
                    });
                }
                else {
                    callback({
                        success: true,
                        numAffected: numAffected
                    });
                }
            });
        },
        /*
         * delete document
         */
        del: function(collection, query, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            DB.post(collection, query, {deleted: true}, function(d){
                callback(d);
            });
        },
        del4ever: function(collection, query, callback) {
            if(!_.isString(collection) || !_.isObject(query) || _.isFunction(query)){
                return false;
            }

            var callback = _.isFunction(callback) ? callback : function(){};

            var config = DB.config(collection);
            
            if(!config.collection || !config.schema) {
                callback({
                    success: false,
                    message: "no collection"
                });
                return;
            }

            var Mod = config.connection.model(collection, config.schema, config.collection);

            Mod.remove(query, function(err){
                if (err) {
                    callback({
                        success: false,
                        message: err.message
                    });
                }
                else {
                    callback({
                        success: true
                    });
                }
            });
        },
        /*
         * config db connection
         */
        config: function(collection) {
            if (!_.isString(collection)) return {};

            var cfg = {};

            switch(collection){
                case 'test':
                    cfg = {
                        collection: "test",
                        schema: testSchema
                    };
                    break;
                case 'question':
                    cfg = {
                        collection: "question",
                        schema: questionSchema
                    };
                    break;
                case 'quiz':
                    cfg = {
                        collection: "quiz",
                        schema: quizSchema
                    };
                    break;
                case 'user':
                    cfg = {
                        collection: "user",
                        schema: userSchema
                    };
                    break;
                default:
                    break;
            }

            cfg.connection = mongoose.createConnection('mongodb://localhost/' + dbName);

            return cfg;
        }
    },

    test = {
        random: function(query, callback) {
            callback = _.isFunction(callback) ? callback : (_.isFunction(query) ? query : function(){});
            query = _.isObject(query) && !_.isFunction(query) ? query : {};
            query.deleted = false;

            console.log(query)

            question.get(query, function(d){
                if (!d.success) {
                    callback(d);
                    return;
                }

                var _docs = _.shuffle(d.docs),
                    _selectQ = _.filter(_docs, function(q){return q.type == 1}),
                    _otherQ = _.filter(_docs, function(q){return q.type != 1}),
                    questions = [],
                    time = 0;
                
                _selectQ.forEach(function(q){
                    if (questions.length < 5) {
                        questions.push({_id: q._id});
                        time += q.time;
                    }
                });

                _otherQ.forEach(function(q){
                    if (time < 90) {
                        questions.push({_id: q._id});
                        time += q.time;
                    }
                });

                callback({
                    success: true,
                    docs: questions,
                    time: time
                });
            });
        },
        put: function(doc, callback) {
            test.random(function(d) {
                if (!d.success) {
                    callback(d);
                    return;
                }

                DB.put("test", {
                    email: doc.email,
                    sha1: doc.sha1,
                    questions: d.docs
                }, function(d){
                    callback(d);
                });
            });
        },
        get: function(query, options, callback) {
            return DB.get("test", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("test", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("test", query, callback);
        },
        del4ever: function(query, callback) {
            return DB.del4ever("test", query, callback);
        }
    },

    question = {
        put: function(doc, callback) {
            return DB.put("question", doc, callback);
        },
        get: function(query, options, callback) {
            return DB.get("question", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("question", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("question", query, callback);
        },
        del4ever: function(query, callback) {
            return DB.del4ever("question", query, callback);
        }
    },

    quiz = {
        put: function(query, doc, callback) {
            if (_.isUndefined(callback)) {
                callback = doc;
                doc = query;
            }

            return DB.put("quiz", doc, callback);
        },
        random: function(query, doc, callback) {
            test.random(query, function(d) {
                console.log(d)
                if (!d.success) {
                    callback(d);
                    return;
                }

                quiz.put({
                    author: doc.author,
                    created: doc.created,
                    questions: d.docs
                }, function(d) {
                    callback(d);
                });
            });
        },
        get: function(query, options, callback) {
            return DB.get("quiz", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("quiz", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("quiz", query, callback);
        },
        del4ever: function(query, callback) {
            return DB.del4ever("quiz", query, callback);
        }
    },

    user = {
        put: function(doc, callback) {
            return DB.put("user", doc, callback);
        },
        get: function(query, options, callback) {
            return DB.get("user", query, options, callback);
        },
        post: function(query, doc, callback) {
            return DB.post("user", query, doc, callback);
        },
        del: function(query, callback) {
            return DB.del("user", query, callback);
        }
    };

// exports
exports.Test = test;
exports.Question = question;
exports.Quiz = quiz;
exports.User = user;
