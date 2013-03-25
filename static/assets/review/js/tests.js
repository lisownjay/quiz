/*
 * @name: tests.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-10-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S){
    var score = S.one("#J_ScoreInput");
    score && score.on("valuechange", function(e){
        var val = parseInt(score.val(), 10) || 0;
        if (val > 100 || val < 0) {
            score.val(e.prevVal);
        }
    });

    var formGrade = S.one("#J_FormGrade");
    formGrade && formGrade.on("submit", function(e){
        e.halt();
        S.io({
            url: "/io/test/grade",
            type: "post",
            form: formGrade,
            success: function(d) {
                if (d && d.success) {
                    alert("提交成功！");
                }
                else{
                    alert("提交失败，请重试！");
                }
            },
            error: function() {
                alert("提交失败，请重试！");
            }
        });
    });
});
