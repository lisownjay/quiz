/*
 * @name: create.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-08
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S) {
    S.one("#J_QuestionCreateForm").on("submit", function(evt){
        evt.halt();

        S.io({
            url: "/io/question/create",
            type: "post",
            form: this,
            complete: function(d) {
                if (!d || !d.success) {
                    alert("出错了，请重试！");
                    return;
                }

                alert("添加成功！");
            }
        });
    });
});
