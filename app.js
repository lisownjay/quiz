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
    authorize = require('./routes/authorize'),
    nobuc = require('./auth/nobuc'),
    user = require('./auth/user'),

    app = module.exports = express();

var stylus = require('stylus')
    , nib = require('nib');

require('jade/lib/inline-tags').push('textarea');
// locals
app.locals.pretty = true;

// BLOBAL
GLOBAL.host = "http://test.ued.taobao.com";
GLOBAL.env = "production";

// WTF
//app.enable('trust proxy');

// Configuration 
app.configure(function(){
    app.set('port', 3001);
    app.use(express.favicon(__dirname + "/static/favicon.ico"));
    app.use(express.logger("dev"));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser('tbued1366988767'));
    app.use(express.cookieSession());
    app.use(express.methodOverride());

    app.use(function(req, res, next) {
        GLOBAL.hostname = req.headers.host;
        GLOBAL.host = "http://" + GLOBAL.hostname;
        next();
        return;
    });

    app.use(nobuc(/^\/(?:__u__|question|quiz|marking|io\/question\/(?:create|update|edit|del)|io\/test\/grade|io\/quiz|io\/email).*/, {
        hostname: GLOBAL.env === "production" ? "login.alibaba-inc.com" : "login-test.alibaba-inc.com",
        apphost: GLOBAL.hostname,
        appname: "tbuedquiz"
    }));

    app.use(user(/^\/(?:__u__|question|quiz|marking|io\/question\/(?:create|update|edit|del)|io\/test\/grade|io\/quiz|io\/email).*/));

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

//var staticMiddleware = express.static(__dirname + '/question');

// Routes

app.post("/", function(req, res, next) {
    routes.quiz.online(req, res);
});

/*
 * question
 */
app.get(/^\/question\/*$/, function(req, res, next) {
    routes.question.list(req, res);
});

app.get(/^\/io\/question(?:\/([a-zA-Z0-9]+))*$/, function(req, res, next) {
    routes.io.question.get(req, res);
});

app.get("/question/create", function(req, res, next) {
    routes.question.create(req, res);
});

app.post("/io/question/create", function(req, res, next) {
    routes.io.question.put(req, res);
});

app.get("/question/edit/:_id", function(req, res, next) {
    routes.question.edit(req, res);
});

app.post("/io/question/edit", function(req, res, next) {
    routes.io.question.post(req, res);
});

app.post("/io/question/del", function(req, res, next) {
    routes.io.question.del(req, res);
});

/*
 * quiz
 */
app.get(/^\/quiz\/*$/, function(req, res, next) {
    routes.quiz.list(req, res);
});

app.get("/marking/2013campus", function(req, res, next) {
    routes.quiz.list(req, res);
});

app.get("/quiz/2013campus", function(req, res, next) {
    req.params.tag = "2013campus";
    routes.quiz.lib(req, res);
});

app.get("/quiz/:_id", function(req, res, next) {
    routes.quiz.one(req, res);
});

app.post("/io/quiz/create", function(req, res, next) {
    routes.io.quiz.put(req, res);
});

app.get("/io/quiz/:_id", function(req, res, next) {
    routes.io.quiz.get(req, res);
});

app.get("/io/quiz", function(req, res, next) {
    routes.io.quiz.get(req, res);
});

/*
 * email
 */

app.post("/io/email/:_id", function(req, res, next) {
    routes.io.email.send(req, res);
});

/*
 * 前台接口
 * test
 */
/*
 *阅卷
 */
app.get("/marking/:_id", function(req, res, next) {
    routes.marking.render(req, res);
});

app.get("/io/test/:_id", function(req, res, next) {
    routes.io.test.get(req, res);
});

app.post("/io/test/solve", function(req, res, next) {
    routes.io.test.solve(req, res);
});

/*
 * admin
 */
app.get(/^\/admin\/*$/, function(req, res, next) {
    res.redirect(301, "/question");
});



app.get("/__u__", function(req, res, next) {
    res.json(req.user);
});

// pass exsits Routes
app.all('*', function(req, res){
    routes.notfound(req, res);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port') + " on " + app.get("env"));
});
