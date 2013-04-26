/*
 * @name: app.js
 * @description: FETest app
 *      反向代理 /test/ 到fetest的应用端口
 * @author: wondger@gmail.com
 * @date: 2012-07-16
 * @param: 
 * @todo: 
 * @changelog: 
 */
var http = require("http"),
    express = require('express'),
    util = require('util'),
    _ = require('underscore'),
    routes = require('./routes'),
    nobuc = require('./auth/nobuc'),

    app = module.exports = express();

var stylus = require('stylus')
    , nib = require('nib');

require('jade/lib/inline-tags').push('textarea');
// locals
app.locals.pretty = true;

// BLOBAL
GLOBAL.host = "http://test.ued.taobao.com";

// WTF
//app.enable('trust proxy');

// Configuration 
app.configure(function(){
    app.set('port', process.env.PORT || 8000);
    app.use(express.favicon());
    app.use(express.logger("dev"));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser('tbued1366988767'));
    app.use(express.cookieSession());
    app.use(express.methodOverride());

    app.use(nobuc(/\/(?:question|tests|admin).*/, {
        hostname: "login-test.alibaba-inc.com",
        appname: "tbuedquiz"
    }));

    app.use(stylus.middleware({
        src: __dirname + '/static'
        , compile: function(str, path) {
            return stylus(str)
                .set('filename', path)
                .set('compress', true)
                .use(nib())
                .import('nib');
        }
    }));

    // 能否直接读取某个静态文件返回？
    app.use(express.static(__dirname + '/static'));
    //app.use(gzippo.staticGzip(__dirname + '/static'));
    app.use(app.router);

    GLOBAL.env = app.get("env");
});

app.configure('development', function(){
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

var staticMiddleware = express.static(__dirname + '/question');

/*
 * 所有非io接口上线后删除
 */

// Routes

/*
 * GET
 */
app.get(/(.*)/,function(req, res, next){
    var sub = req.params[0].replace(/^\//,'');

    switch(sub.toLowerCase()){
        case 'question':
        case 'question/':
            routes.question.render(req, res);
            break;
        case 'question/create':
            routes.question.create(req, res);
            break;
        case 'io/question':
            routes.io.question.get(req, res);
            break;
        case 'tests':
            routes.tests(req, res);
            break;
        case 'login.html':
            res.charset = "utf-8";
            staticMiddleware(req, res, next);
            break;
        case 'admin':
            res.render("admin", {
                title: "admin"
            });
            break;
        default:
            if (/^(?:test\/)[^.]+$/.test(sub)) {
                routes.test(req, res);
            }
            else if (/^(?:tests\/)[^.]+$/.test(sub)) {
                routes.tests(req, res);
            }
            else if (/^(?:io\/test\/)[^.]+$/.test(sub)) {
                routes.io.test.get(req, res);
            }
            else if (/^(?:io\/question\/)[^.]+$/.test(sub) && GLOBAL.authorized) {
                routes.io.question.get(req, res);
            }
            else if (/^question\/edit\/[a-zA-Z0-9]{24}/.test(sub)) {
                req.params._id = sub.replace(/^question\/edit\/([a-zA-Z0-9]{24})/, "$1");
                routes.question.edit(req, res);
            }
            else if (/^quiz\/[a-zA-Z0-9]{24}/.test(sub)) {
                req.params._id = sub.replace(/^quiz\/([a-zA-Z0-9]{24})/, "$1");
                routes.io.quiz.render(req, res);
            }
            else {
                next();
            }
            break;
    }
});


/*
 * POST
 */
app.post(/(.*)/,function(req, res, next){
    var sub = req.params[0].replace(/^\//,'');

    switch(sub.toLowerCase()){
        case '':
        case 'index':
            routes.index(req, res);
            break;
        case 'io/question/create':
            routes.io.question.put(req, res);
            break;
        case 'io/question/edit':
        case 'io/question/update':
            routes.io.question.post(req, res);
            break;
        case 'io/question/del':
            routes.io.question.del(req, res);
            break;
        case 'io/test/solve':
            routes.io.test.solve(req, res);
            break;
        case 'io/test/grade':
            routes.io.test.grade(req, res);
            break;
        case 'io/test/del':
            routes.io.test.del(req, res);
            break;
        case 'io/tests/update':
            routes.io.test.post(req, res, true);
            break;
        case 'io/quiz/create':
            routes.io.quiz.put(req, res);
            break;
        default:
            if (/^(?:io\/email\/).+$/.test(sub)) {
                routes.email(req, res);
                return;
            }
            next();
            break;
    }
});

/*
 * PUT
 */
/*
 *app.put(/(.*)/,function(req, res, next){
 *
 *    var sub = req.params[0].replace(/^\//,'');
 *
 *    switch(sub.toLowerCase()){
 *        case 'question':
 *            routes.io.question.put(req, res);
 *            break;
 *        case 'user':
 *            routes.io.user.put(req, res);
 *            break;
 *        default:
 *            next();
 *            break;
 *    }
 *});
 */

/*
 * DELETE
 */
/*
 *app.del(/(.*)/,function(req, res, next){
 *
 *    var sub = req.params[0].replace(/^\//,'');
 *
 *    switch(sub.toLowerCase()){
 *        case 'question':
 *            routes.io.question.del(req, res);
 *            break;
 *        case 'test':
 *            routes.io.test.del(req, res);
 *            break;
 *        default:
 *            next();
 *            break;
 *    }
 *});
 */

// pass exsits Routes
app.all('*', function(req, res){
    routes.notfound(req, res);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port') + " on " + app.get("env"));
});
