/*
 * @name: test.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-10-09
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S){
    var questions = S.all(".question"),
        codingAreas = S.all(".coding-area"),
        win = S.one(window),
        doc = S.one(document),
        wh = win.height(),
        activeIndex = 0;
    questions.each(function(q, i){
        q.data("index", i);
        q.height(wh - 80);
    });
    S.later(function(){
        doc.scrollTop(0);
    }, 60);
    codingAreas.height(wh);
    win.on("resize", function(){
        wh = S.one(window).height();
        questions.height(wh - 80);
        codingAreas.height(wh);
    }).on("keydown", function(e){
        console.log(e.keyCode);

        if (e.keyCode === 39 || e.keyCode === 40) {
            activeIndex = activeIndex < questions.length - 1 ? activeIndex + 1 : activeIndex;
        }
        else if (e.keyCode === 37 || e.keyCode === 38) {
            activeIndex = activeIndex > 0 ? activeIndex - 1 : activeIndex;
        }

        doc.scrollTop(activeIndex * wh);
    });

    var btnCoding = S.all(".btn-coding");
    btnCoding.on("click", function(){
        S.one(this).next().toggle();
    });
});
