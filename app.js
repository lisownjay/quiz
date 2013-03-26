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
var os = require("os"),
    express = require('express'),
    util = require('util'),
    _ = require('underscore'),
    routes = require('./routes'),
    auth = require('./auth');

    app = module.exports = express();

// locals
app.locals.pretty = false;

// BLOBAL
GLOBAL.authorized = false;
GLOBAL.hostname = "http://test.ued.taobao.com";

// WTF
app.enable('trust proxy');

// Configuration 
app.configure(function(){
    app.use(express.logger("dev"));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    // must set 'secret' for session
    app.use(express.cookieParser('secret'));
    app.use(express.methodOverride());
    // 能否直接读取某个静态文件返回？
    app.use(express.static(__dirname + '/static'));
    //app.use(gzippo.staticGzip(__dirname + '/static'));
    app.use(app.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({dumpExceptions: true, showStack: true}));
    GLOBAL.env = 'development';
});

app.configure('production', function(){
    app.use(express.errorHandler());
    GLOBAL.env = 'production';
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

    if (auth.check(req, res)) {
        GLOBAL.authorized = true;
    }
    else {
        GLOBAL.authorized = false;
    }

    switch(sub.toLowerCase()){
        case 'question':
            routes.question(req, res);
            break;
        case 'io/question':
            if (GLOBAL.authorized) {
                routes.io.question.get(req, res);
                return;
            }
            next();
            break;
        case 'tests':
            if (GLOBAL.authorized) {
                routes.tests(req, res);
                return;
            }
            else {
                res.redirect(GLOBAL.hostname + "/login.html")
            }
            break;
        case 'login.html':
            res.charset = "utf-8";
            staticMiddleware(req, res, next);
            break;
        case 'admin':
            if (GLOBAL.authorized) {
                res.render("admin", {
                    title: "admin"
                });
            }
            else {
                res.redirect(GLOBAL.hostname + "/login.html")
            }
            break;
        case 'edit.html':
            if (GLOBAL.authorized) {
                res.charset = "utf-8";
                staticMiddleware(req, res, next);
            }
            else {
                res.redirect(GLOBAL.hostname + "/login.html")
            }
            break;
        case 'list.html':
            if (GLOBAL.authorized) {
                res.charset = "utf-8";
                staticMiddleware(req, res, next);
            }
            else {
                res.redirect(GLOBAL.hostname + "/login.html")
            }
            break;
        default:
            if (/^(?:test\/)[^.]+$/.test(sub)) {
                routes.test(req, res);
            }
            else if (/^(?:tests\/)[^.]+$/.test(sub)) {
                if (GLOBAL.authorized) {
                    routes.tests(req, res);
                }
                else {
                    res.redirect(GLOBAL.hostname + "/login.html")
                    return;
                }
            }
            else if (/^(?:io\/test\/)[^.]+$/.test(sub)) {
                routes.io.test.get(req, res);
            }
            else if (/^(?:io\/question\/)[^.]+$/.test(sub) && GLOBAL.authorized) {
                routes.io.question.get(req, res);
            }
            else if (/^(mods\/)/) {
                res.charset = "utf-8";
                staticMiddleware(req, res, next);
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

    if (auth.check(req, res)) {
        GLOBAL.authorized = true;
    }
    else {
        GLOBAL.authorized = false;
    }

    switch(sub.toLowerCase()){
        case '':
        case 'index':
            routes.index(req, res);
            break;
        case 'io/question/create':
            if (GLOBAL.authorized) {
                routes.io.question.put(req, res);
            }
            break;
        case 'io/question/update':
            if (GLOBAL.authorized) {
                routes.io.question.post(req, res);
            }
            break;
        case 'io/question/del':
            if (GLOBAL.authorized) {
                routes.io.question.del(req, res);
            }
            break;
        case 'io/test/solve':
            routes.io.test.solve(req, res);
            break;
        case 'io/test/grade':
            if (GLOBAL.authorized) {
                routes.io.test.grade(req, res);
            }
            break;
        case 'io/test/del':
            if (GLOBAL.authorized) {
                routes.io.test.del(req, res);
            }
            break;
        case 'io/tests/update':
            if (GLOBAL.authorized) {
                routes.io.test.post(req, res, true);
            }
            break;
        case 'login.html':
            if (auth.check(req, res)) {
                GLOBAL.authorized = true;
                res.redirect(GLOBAL.hostname + "/admin");
            }
            else {
                GLOBAL.authorized = false;
                res.redirect(GLOBAL.hostname + "/login.html");
            }
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

app.listen(3001);
console.log("fetest on port %d in %s mode", 3001, app.settings.env);
