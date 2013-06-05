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
    db = require("../db"),
    Email = require("../email"),
    sha1 = require("../util").testSha1,
    util = require("../util"),
    moment = require("moment");

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
                db.put({
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

            db.post({
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

            db.get({
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
                            docs[index] = {
                                _id: doc._id,
                                content: util.escapeQuestion(doc.content),
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


            db.del({
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
        get: function(req, res) {
            db.get({
                collection: "quiz",
                query: {_id: req.params._id},
                fields: {
                    author: 0,
                    authorNick: 0,
                    email: 0,
                    emailed: 0,
                    created: 0,
                    level: 0
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
                            message: "No quiz"
                        });
                        return;
                    }

                    docs[0].visited.push(new Date())
                    db.post({
                        collection: "quiz",
                        query: {_id: req.params._id},
                        doc: {visited: docs[0].visited}
                    });

                    docs[0].questions.forEach(function(question, index) {
                        docs[0].questions[index] = {
                            index: index,
                            content: util.escapeQuestion(question.content),
                            answer: question.answer
                        };
                    });

                    var leftTime = 3600;
                    if (docs[0].visited && docs[0].visited.length) {
                        // default 60min
                        leftTime = Math.floor(3600 - (new Date() - new Date(docs[0].visited[0])) / 1000);
                    }

                    res.json({
                        success: true,
                        _id: docs[0]._id,
                        time: leftTime > 0 ? leftTime : 0,
                        docs: docs[0].questions
                    });
                }
            });
        },
        solve: function(req, res) {
            if (!req.body._id) {
                res.json({
                    success: false,
                    message: "No _id"
                });
                return;
            }


            db.get({
                collection: "quiz",
                query: {_id: req.body._id},
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
                            message: "No quiz"
                        });
                        return;
                    }

                    var finished = quiz.checkFinished(docs[0]);

                    if (finished) {
                        res.json({
                            success: false,
                            message: "timeout"
                        });
                        return;
                    }


                    req.body.answer.forEach(function(a, index) {
                        docs[0].questions[index].answer = a;
                    });

                    db.post({
                        collection: "quiz",
                        query: {_id: req.body._id},
                        doc: {questions: docs[0].questions},
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
            });
        }
    }
    
    quiz = {
        get: function(req, res) {
            var query = {};

            if (req.params._id) {
                query._id = req.params._id;
            }
            else if (!req.user.loginName) {
                res.json({
                    success: false,
                    message: "Permission error"
                });
                return;
            }

            db.get({
                collection: "quiz",
                query: query,
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

                    docs.forEach(function(doc, index) {
                        doc.created = moment(doc.created).format("YYYY-MM-DD HH:mm:ss");
                        doc.finished = quiz.checkFinished(doc);
                    });

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

            db.Quiz.get({
                _id: _id
            }, function(d){
                if (!d || !d.success) {
                    res.json({
                        success: false,
                        message: "find quiz error."
                    })
                    return;
                }

                db.Question.get({
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
        checkFinished: function(quiz) {
            if (!quiz || !quiz.email || !quiz.visited || !quiz.visited.length) return false;

            var finished = 3600 - (new Date() - new Date(quiz.visited[0])) / 1000 <= 0;

            if (finished || !!quiz.finished) {
                db.post({
                    collection: "quiz",
                    query: {_id: quiz._id},
                    doc: {finished: finished}
                });
            }

            return finished || quiz.finished;
        },
        generate: function(questions, random) {
            var questions = random ? _.shuffle(questions) : questions,
                ret = {
                    questions: [],
                    time: 0,
                    level: 0
                };

            if (!questions.length) return ret;

            questions[random ? "some" : "forEach"](function(doc, index) {
                ret.time += doc.time;
                ret.level += doc.level;
                ret.questions.push(doc);

                if (random && ret.time > 60) return true;
            });

            ret.level = Math.round(ret.level / ret.questions.length);

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
                doc.authorNick = req.user.nick;
            }

            db.get({
                collection: "question",
                query: query,
                options: {sort: {created: -1}},
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

                    doc.created = new Date();

                    db.put({
                        collection: "quiz",
                        doc: _.extend(doc, quiz.generate(docs, true)),
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


            db.get({
                collection: "question",
                query: {
                    _id: {$in: req.body.questions}
                },
                options: {sort: {created: -1}},
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

                    var doc = _.extend({
                            created: new Date(),
                            author: req.user.loginName,
                            authorNick: req.user.nick
                        }, quiz.generate(docs));

                    db.put({
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
        }
    },
    
    email = {
        send: function(req, res) {
            var _email = req.body.email,
                _id = req.params._id;

            if (!_id || !_email) {
                res.json({
                    success: false,
                    message: "Param error"
                });
                return;
            }

            db.get({
                collection: "quiz",
                query: {
                    _id: _id
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

                    if (docs[0].email === _email) {
                        Email({
                            email: _email,
                            url: GLOBAL.host + "/test.html?i=" + _id,
                            complete: function(d) {
                                if (!d.success) {
                                    res.json({
                                        success: false,
                                        message: "Email error"
                                    });
                                    return;
                                }

                                res.json({
                                    success: true
                                });
                            }
                        });
                    }
                    else if (!docs[0].email) {
                        db.post({
                            collection: "quiz",
                            query: {_id: _id},
                            doc: {
                                email: _email
                            },
                            complete: function(err, numAffected) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err.message
                                    });
                                    return;
                                }

                                Email({
                                    email: _email,
                                    url: GLOBAL.host + "/test.html?i=" + _id,
                                    complete: function(d) {
                                        if (!d.success) {
                                            res.json({
                                                success: false,
                                                message: "Email error"
                                            });
                                            return;
                                        }

                                        res.json({
                                            success: true
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        docs[0].email = _email;
                        docs[0].author = req.user.loginName;
                        docs[0].authorNick = req.user.nick;
                        docs[0].created = new Date();

                        db.put({
                            collection: "quiz",
                            doc: docs[0],
                            complete: function(err, doc) {
                                if (err) {
                                    res.json({
                                        success: false,
                                        message: err.message
                                    });
                                    return;
                                }

                                Email({
                                    email: _email,
                                    url: GLOBAL.host + "/test.html?i=" + doc._id,
                                    complete: function(d) {
                                        if (!d.success) {
                                            res.json({
                                                success: false,
                                                message: "Email error"
                                            });
                                            return;
                                        }

                                        res.json({
                                            success: true
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
    };


exports.test = {
    render: function(req, res) {
        db.get({
            collection: "quiz",
            query: {_id: req.params._id},
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

                docs[0].questions.forEach(function(q, index) {
                    q.content = util.escapeQuestion(q.content);
                });

                res.render("test", {
                    title: "Test",
                    questions: docs[0].questions
                });
            }
        });
    }
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
            author: req.user.loginName,
            authorNick: req.user.nick || req.user.loginName,
            url: encodeURIComponent("https://login" + (GLOBAL.env === "production" ? "" : "-test") + ".alibaba-inc.com/ssoLogin.htm?APP_NAME=tbuedquiz&BACK_URL=" + encodeURIComponent(req.protocol + "://" + req.host + req.url))
        });
    },
    edit: function(req, res) {
        if (!req.params._id) {
            res.send("Param _id error");
            return;
        }

        db.get({
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
                    authorNick: docs[0].authorNick || docs[0].authornick,
                    url: encodeURIComponent("https://login" + (GLOBAL.env === "production" ? "" : "-test") + ".alibaba-inc.com/ssoLogin.htm?APP_NAME=tbuedquiz&BACK_URL=" + encodeURIComponent(req.protocol + "://" + req.host + req.url))
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
    },
    one: function(req, res) {
        if (!req.params._id) {
            res.json({
                success: false,
                message: "No _id"
            });
            return;
        }

        db.get({
            collection: "quiz",
            query: {_id: req.params._id},
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
                        message: "No quiz"
                    });
                    return;
                }

                docs[0].questions.forEach(function(doc) {
                    doc.content = util.escapeQuestion(doc.content);
                });

                res.render("quiz", {
                    title: "quiz",
                    _id: docs[0]._id,
                    questions: docs[0].questions,
                    level: docs[0].level,
                    time: docs[0].time,
                    backurl: req.header("referer")
                });
            }
        });
    },
    online: function(req, res) {
        if (!req.body.email) {
            res.json({
                success: false,
                message: "No email"
            });
            return;
        }

        db.get({
            collection: "quiz",
            query: {email: req.body.email},
            complete: function(err, docs) {
                if (err) {
                    res.json({
                        success: false,
                        message: err.message
                    });
                    return;
                }

                if (!docs) {
                    res.json({
                        success: false,
                        message: "No quiz"
                    });
                    return;
                }

                if (!docs.length) {
                    db.get({
                        collection: "question",
                        options: {sort: {created: -1}},
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

                            var doc = {
                                email: req.body.email,
                                created: new Date()
                            };

                            doc = _.extend(doc, quiz.generate(docs, true));

                            db.put({
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

                                    Email({
                                        email: req.body.email,
                                        url: GLOBAL.host + "/test.html?i=" + doc._id,
                                        complete: function(d) {
                                            if (!d.success) {
                                                res.json({
                                                    success: false,
                                                    message: "Email error"
                                                });
                                                return;
                                            }

                                            res.render("emailed", {
                                                title: "TaobaoUED",
                                                email: req.body.email,
                                                text: "答题地址已发送至您的邮箱！"
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else {
                    Email({
                        email: req.body.email,
                        url: GLOBAL.host + "/test.html?i=" + docs[0]._id,
                        complete: function(d) {
                            if (!d.success) {
                                res.json({
                                    success: false,
                                    message: "Email error"
                                });
                                return;
                            }

                            res.render("emailed", {
                                title: "TaobaoUED",
                                email: req.body.email,
                                text: "答题地址已发送至您的邮箱！"
                            });
                        }
                    });
                }
            }
        });
    }
};


exports.io = {
    question: question,
    test: test,
    quiz: quiz,
    email: email
};

exports.notfound = function(req, res) {
    res.status(404).render("404", {
        title: "FETest"
    });
};
