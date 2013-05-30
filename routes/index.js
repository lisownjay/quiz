/*
 * @name: routes.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-09-19
 * @param: 
 * @todo: 
 * @changelog: 
 */
var _ = require("underscore"),
    DB = require("../db"),
    Email = require("../email"),
    sha1 = require("../util").testSha1,
    util = require("../util");

var question = {
        put: function(req, res) {
            var doc = _.pick(req.body, "level", "skill", "type", "content", "time", "remark", "from", "author", "authorNick");

            if (!doc.level || !doc.skill || !doc.time || !doc.content || !doc.author || !doc.content.replace(/^\s+/, '').replace(/\s+$/, '')) {
                res.json({
                    success: false,
                    message: "有未填写字段！题目、知识点、难度、耗时都是必填项！"
                });
                return;
            }

            doc.created = new Date();

            doc.author = req.user.loginName;
            doc.authorNick = req.user.nick;

            create();

            function create() {
                DB.put({
                    collection: "question",
                    doc: doc,
                    complete: function(err, doc) {
                        if (err) {
                            res.json({
                                success: false,
                                message: "DB error"
                            });
                            return;
                        }

                        res.json({
                            success: true,
                            doc: doc
                        });
                    }
                });
            }
        },
        post: function(req, res) {
            var doc = _.pick(req.body, "content", "skill", "type", "level", "time", "remark", "from", "author");

            if(!req.body._id) {
                res.json({
                    success: false,
                    message: "Param error"
                });
                return;
            }

            DB.post({
                collection: "question",
                query: {
                    _id: req.body._id
                },
                doc: doc,
                complete: function(err, numAffected) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    res.json({
                        success: true,
                        numAffected: numAffected
                    });
                }
            });
        },
        get: function(req, res) {
            var _id = req.params[0],
                query = {};

            if (_id) query._id = _id;

            DB.get({
                query: query,
                collection: "question",
                options: {
                    sort: {
                        created: -1
                    }
                },
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    if (docs) {
                        docs.forEach(function(doc, index){
                            var content = query._id ? doc.content : util.escapeQuestion(doc.content);
                            docs[index] = {
                                _id: doc._id,
                                content: content,
                                created: doc.created,
                                author: doc.author,
                                authorNick: doc.authorNick,
                                time: doc.time,
                                type: doc.type,
                                level: doc.level,
                                skill: doc.skill,
                                from: doc.from,
                                remark: doc.remark
                            };
                        });
                    }

                    res.json({
                        success: true,
                        docs: docs
                    });
                }
            });
        },
        del: function(req, res) {
            if(!req.body._id) {
                res.json({
                    success: false,
                    message: "Param error"
                });
                return;
            }


            DB.del({
                collection: "question",
                query: {
                    _id: req.body._id
                },
                complete: function(err, numAffected) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    res.json({
                        success: true,
                        numAffected: numAffected
                    });
                }
            });
        }
    },

    test = {
        get: function(req, res, callback, _sha1) {
            var sha1 = _sha1 || req.params[0].replace(/^(?:(?:\/io)?\/test\/)(.+)$/, "$1"),
                query = {};

            if (sha1) {
                query.sha1 = sha1;
                // update visted field
                if (!_sha1) {
                    DB.Test.post(query, {$push: {visited: new Date()}}, function(d){
                        // todo
                    });
                }
            }

            DB.Test.get(query, function(d){
                if (!d.success || !d.docs.length) {
                    callback ? callback(d) : res.json(d);
                    return;
                }

                var _id = d.docs[0]._id,
                    score = d.docs[0].score,
                    email = d.docs[0].email,
                    now = new Date(),
                    visited = d.docs[0].visited,
                    time = d.docs[0].finished ? 0 : (visited.length ? 3600 - (now - visited[0])/1000 : d.docs[0].time),
                    time = time <= 0 ? 0 : time;
                    questions = {
                        _ids: [],
                        answer: {},
                        score: {} 
                    };

                if (time <= 0) {
                    DB.Test.post(query, {finished: true}, function(d){
                        // todo
                    });
                }

                d.docs[0].questions.forEach(function(question){
                    questions._ids.push(question._id);
                    questions.answer[question._id] = question.answer || {};
                    questions.score[question._id] = question.score || "";
                });

                DB.Question.get({
                    _id: {$in: questions._ids},
                    deleted: false
                }, function(d){
                    var docs = [];
                    if (d.docs) {
                        d.docs.forEach(function(doc){
                            var content = util.escapeQuestion(doc.content);
                            // todo: authorized remove
                            docs.push({
                                _id: doc._id,
                                content: content,
                                created: GLOBAL.authorized ? doc.created : "",
                                author: GLOBAL.authorized ? doc.author : "",
                                time: GLOBAL.authorized ? doc.time : "",
                                type: GLOBAL.authorized ? doc.type : "",
                                level: GLOBAL.authorized ? doc.level : "",
                                skill: GLOBAL.authorized ? doc.skill : "",
                                remark: GLOBAL.authorized ? doc.remark : "",
                                answer: questions.answer[doc._id],
                                score: GLOBAL.authorized ? questions.score[doc._id] : ""
                            });
                        });
                    }

                    d._id = _id;
                    d.score = score;
                    d.email = email;
                    d.time = Math.floor(time);
                    d.docs = docs;
                    callback ? callback(d) : res.json(d);
                });
            });
        },
        solve: function(req, res) {
            var query = _.pick(req.body, "_id"),
                finished = false,
                questions,
                docs;

            if(!query._id) {
                res.json({
                    success: false,
                    message: "PARAM ERR"
                });
                return;
            }

            query.finished = false;

            DB.Test.get(query, function(d){
                if (!d.success || !d.docs.length || !d.docs[0].questions || !d.docs[0].questions.length) {
                    res.json({
                        success: false,
                        message: "TEST NOT EXSITED || TIMEOUT"
                    });
                    return;
                }
                else {
                    var questions = d.docs[0].questions;

                    if (d.docs[0].finished) {
                        finished = d.docs[0].finished;
                    }
                    else if (d.docs[0].visited.length) {
                        var started = d.docs[0].visited[d.docs[0].visited.length - 1],
                            now = new Date();
                        finished = (now - started)/60000 > 60 ? true : false;
                    }

                    questions.forEach(function(d, i){
                        // 答题
                        questions[i].answer = d.answer = d.answer || {};
                        var reqq = req.body[d._id] || {};
                        questions[i].answer.html = reqq.html || d.answer.html || "";
                        questions[i].answer.css = reqq.css || d.answer.css || "";
                        questions[i].answer.javascript = reqq.javascript || d.answer.javascript || "";
                        questions[i].answer.select = reqq.select || d.answer.select || "";
                    });

                    DB.Test.post(query, {questions: questions, finished: finished}, function(d){
                        res.json(d);
                    });
                }
            });
        },
        // 打分
        grade: function(req, res) {
            var query = _.pick(req.body, "_id"),
                finished = false;

            if(!query._id) {
                res.json({
                    success: false,
                    message: "PARAM ERR"
                });
                return;
            }

            DB.Test.get(query, function(d){
                if (!d.success || !d.docs.length || !d.docs[0].questions || !d.docs[0].questions.length) {
                    res.json({
                        success: false,
                        message: "TEST NOT EXSITED"
                    });
                    return;
                }
                else {
                    var questions = d.docs[0].questions;

                    if (d.docs[0].finished) {
                        finished = d.docs[0].finished;
                    }
                    else if (d.docs[0].visited.length) {
                        var started = d.docs[0].visited[d.docs[0].visited.length - 1],
                            now = new Date();
                        finished = (now - started)/60000 > 65 ? true : false;
                    }

                    /*
                    questions.forEach(function(d, i){
                        // 超时后不可写入答案
                        if (!isGrade && !finished) {
                            // 答题
                            questions[i].answer = req.body[d._id] || d.answer || "";
                        }
                        else {
                            // 为每个题目打分
                            // questions[i].score = parseInt(req.body[d._id], 10) || 0;
                        }
                    });
                    */

                    DB.Test.post(query, {finished: finished, score: parseInt(req.body.score, 10) || 0}, function(d){
                        res.json(d);
                    });
                }
            });
        },
        sum: function(req, res) {
            DB.Test.get({deleted: false}, function(d){
                if (d && d.success) {
                    res.json({
                        sum: d.docs.length,
                        ing: _.filter(d.docs, function(t){return !t.finished}).length,
                        finished: _.filter(d.docs, function(t){return t.finished}).length
                    });
                }
            });
        }
    },
    
    quiz = {
        get: function(req, res) {
            var query = {};

            if (req.params._id) {
                query._id = req.params._id;
            }

            DB.get({
                collection: "quiz",
                query: query,
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    res.json({
                        success: true,
                        docs: docs
                    });
                }
            });
        },
        render: function(req, res) {
            var _id = req.params._id;

            if (!_id) {
                res.send("can not find quiz.");
                return;
            }

            DB.Quiz.get({
                _id: _id
            }, function(d){
                if (!d || !d.success) {
                    res.json({
                        success: false,
                        message: "find quiz error."
                    })
                    return;
                }

                DB.Question.get({
                    _id: {$in: d.docs[0].questions}
                }, function(d){
                    if (!d || !d.success) {
                        res.json({
                            success: false,
                            message: "find question error."
                        })
                        return;
                    }

                    d.docs.forEach(function(doc){
                        doc.content = util.escapeQuestion(doc.content);
                    });

                    res.render("quiz", {
                        title: "quiz",
                        quizs: d.docs
                    });
                })
            })

        },
        generate: function(docs) {
            var docs = _.shuffle(docs),
                ret = [],
                time = 0;

            docs.some(function(doc, index) {
                if (time > 60) return true;

                time += doc.time;
                ret.push(doc);
            });

            return ret;
        },
        random: function(req, res) {
            var doc = _.pick(req.body, "email"),
                query = {};

            if (req.body.skill) {
                query.skill = new RegExp('\\b' + req.body.skill.split('|').join('\\b|\\b') + '\\b', 'i');
            }
            if (req.body.type) {
                query.type = {'$in': req.body.type.split('|')};
            }
            if (req.body.level) {
                query.level = {'$in': req.body.level.split('|')};
            }

            // not interviewee
            if (!doc.email) {
                doc.author = req.user.loginName;
            }

            DB.get({
                collection: "question",
                query: query,
                fields: {
                    _id: 1,
                    id: 1,
                    content: 1,
                    level: 1,
                    remark: 1,
                    skill: 1,
                    time: 1,
                    type: 1
                },
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    doc.questions = quiz.generate(docs);
                    doc.created = new Date();

                    if (!doc.questions|| !doc.questions.length) {
                        res.json({
                            success: false,
                            message: "No question"
                        });
                        return;
                    }

                    DB.put({
                        collection: "quiz",
                        doc: doc,
                        complete: function(err, doc) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err.message
                                });
                                return;
                            }

                            res.json({
                                success: true,
                                doc: doc
                            });
                        }
                    });
                }
            });
        },
        put: function(req, res) {
            if (req.body.random) {
                this.random(req, res);
                return;
            }

            /*
             * 非随机模式下无题目
             */
            if (!req.body.questions || !req.body.questions.length) {
                res.json({
                    success: false,
                    message: "No question"
                });
                return;
            }


            DB.get({
                collection: "question",
                query: {
                    _id: {$in: req.body.questions}
                },
                fields: {
                    _id: 1,
                    id: 1,
                    content: 1,
                    level: 1,
                    remark: 1,
                    skill: 1,
                    time: 1,
                    type: 1
                },
                complete: function(err, docs) {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                        return;
                    }

                    if (!docs || !docs.length) {
                        res.json({
                            success: false,
                            message: "No question"
                        });
                        return;
                    }


                    DB.put({
                        collection: "quiz",
                        doc: {
                            questions: docs,
                            created: new Date(),
                            author: req.user.loginName
                        },
                        complete: function(err, doc) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err.message
                                });
                                return;
                            }

                            res.json({
                                success: true,
                                doc: doc
                            });
                        }
                    });
                }
            });
        }
    };

exports.index = function(req, res) {
    var email = req.body.email || '',
        hash;

    if (!email) {
        res.redirect("/");
    }
    else {
        DB.Test.get({
            email: email
        }, function(d){
            /*
             * 账号已创建
             */
            if (d.success && d.docs.length) {
                /*
                 * 发送过email
                 */
                hash = d.docs[0].sha1;
                if (d.docs[0].emailed.length > 0) {
                    // 访问过
                    if (d.docs[0].visited.length) {
                        //console.log("visited")
                        /*
                         *res.render("emailed", {
                         *    title: "The F2E of world!",
                         *    sha1: d.docs[0].sha1,
                         *    text: "答题地址已发送至您的邮箱！"
                         *});
                         */
                    }
                    // 未访问过
                    // 可能没有收到email，再次发送
                    else {
/*
 *                        util.sendURL(email, GLOBAL.host, function(d){
 *                            if (!d || !d.success) {
 *                                res.send("error");
 *                            }
 *
 *                            res.render("emailed", {
 *                                title: "The F2E of world!",
 *                                sha1: d.docs[0].sha1,
 *                                text: "答题地址已发送至您的邮箱！"
 *                            });
 *                        });
 */
                        //console.log("not visited")
                    }

                    util.sendURL(email, GLOBAL.host, function(d){
                        if (!d || !d.success) {
                            res.send("error");
                            return;
                        }

                        res.render("emailed", {
                            title: "The F2E of world!",
                            sha1: hash,
                            text: "答题地址已发送至您的邮箱！"
                        });
                    });
                }
                /*
                 * 没有发送过email
                 */
                else {
                    util.sendURL(email, GLOBAL.host, function(d){
                        if (!d || !d.success) {
                            res.send(d.message);
                        }

                        res.render("emailed", {
                            title: "The F2E of world!",
                            sha1: d.docs[0].sha1,
                            text: "答题地址已发送至您的邮箱！"
                        });
                    });
                }
            }
            /*
             * 创建考卷
             */
            else {
                hash = sha1(email + new Date());
                DB.Test.put({
                    email: email,
                    sha1: hash
                }, function(d){
                    if (!d || !d.success) {
                        res.send("error");
                        return;
                    }

                    util.sendURL(email, GLOBAL.host, function(d){
                        if (!d || !d.success) {
                            res.send("error");
                        }

                        res.render("emailed", {
                            title: "The F2E of world!",
                            sha1: hash,
                            text: "答题地址已发送至您的邮箱！"
                        });
                    });
                });
            }
        })
    }

};

exports.test = function(req, res) {
    test.get(req, res, function(d){
        res.render("test", {
            title: "Challenge! The F2E of world!",
            error: d.success && d.docs.length ? "" : "no test!",
            questions: d.docs,
            _id: d._id
        });
    });
};


/*
 * question render
 */
exports.question = {
    list: function(req, res) {
        res.render("question", {
            title: "question"
        });
    },
    create: function(req, res) {
        res.render("question-form", {
            title: "question.create",
            content: "",
            _id: "",
            type: -1,
            skill: {
                html: false,
                javascript: false,
                css: false
            },
            level: -1,
            time: "",
            remark: "",
            from: "",
            author: req.user.email,
            authorNick: req.user.nick
        });
    },
    edit: function(req, res) {
        if (!req.params._id) {
            res.send("Param _id error");
            return;
        }

        DB.get({
            collection: "question",
            query: {
                _id: req.params._id
            },
            complete: function(err, docs) {
                if (err) {
                    res.send(err.message);
                    return;
                }

                res.render("question-form", {
                    title: "question.edit",
                    content: docs[0].content,
                    _id: docs[0]._id,
                    type: docs[0].type,
                    skill: {
                        html: docs[0].skill.indexOf("html") >= 0,
                        javascript: docs[0].skill.indexOf("javascript") >= 0,
                        css: docs[0].skill.indexOf("css") >= 0
                    },
                    level: docs[0].level,
                    time: docs[0].time,
                    remark: docs[0].remark,
                    from: docs[0].from || "",
                    author: docs[0].author,
                    authorNick: docs[0].authorNick
                });
            }
        });
    }
};

/*
 * quiz render
 */
exports.quiz = {
    list: function(req, res) {
        res.render("quizs", {
            title: "quiz"
        });
    }
};


/*
 * 发送email
 */
exports.email = function(req, res) {
    var sha1 = req.params[0].replace(/^(?:\/io\/email\/)(.+)$/, "$1"),
        query = {sha1: sha1};

    if (!sha1) {
        res.json({
            success: false,
            message: "PARAM ERR"
        });

        return;
    }

    DB.Test.get(query, function(d){
        if (!d || !d.success || !d.docs.length) {
            res.json({
                success: false,
                message: "NOT EXSITED"
            });
            return;
        }

        // 最多发送5次
        if (d.docs[0].emailed.length >= 20) {
            res.json({
                success: false,
                message: "times limited"
            });
            return;
        }

        util.sendURL(d.docs[0].email, GLOBAL.host, function(d){
            res.json(d);
        });
    });
};

exports.tests = function(req, res) {
    var sha1 = req.params[0].replace(/^(?:\/tests\/)(.+)$/, "$1");

    if (!sha1 || sha1 === "/tests") {
        DB.Test.get({}, function(d){
            if (d && d.docs && d.docs.length) {
                var now = new Date();

                d.docs.forEach(function(test, i){
                    if (test.finished) {
                        d.docs[i].spend = test.time
                    }
                    else {
                        d.docs[i].spend = test.visited.length ? now - test.visited[0] : 0;
                        d.docs[i].spend = Math.ceil(d.docs[i].spend / 60000);
                    }

                    // 更新finished
                    if (!test.finished && d.docs[i].spend >= test.time) {
                        d.docs[i].finished = true;
                        d.docs[i].spend = test.time
                        DB.Test.post({sha1: test.sha1},{finished: true}, function(d){
                        });
                    }
                });

                res.render("tests", {
                    title: "tests",
                    sum: d.docs.length,
                    ing: _.filter(d.docs, function(t){return !t.finished}).length,
                    finished: _.filter(d.docs, function(t){return t.finished}).length,
                    tests: d.docs
                });
            }
            else {
                res.render("tests", {
                    title: "tests",
                    sum: 0,
                    ing: 0,
                    finished: 0,
                    tests: []
                });
            }
        });
    }
    else {
        test.get(req, res, function(d){
            res.render("tests-item", {
                title: "tests",
                _id: d._id,
                email: d.email,
                score: d.score,
                questions: d.docs
            });
        }, sha1);
    }
};

exports.io = {
    question: question,
    test: test,
    quiz: quiz
};

exports.notfound = function(req, res) {
    res.status(404).render("404", {
        title: "FETest"
    });
};
