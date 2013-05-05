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
    S.one("#J_QuestionForm").on("submit", function(evt){
        evt.halt();

        var data = S.unparam(S.io.serialize(this));

        S.io({
            url: data._id ? "/io/question/edit" : "/io/question/create",
            type: "post",
            form: this,
            complete: function(d) {
                if (!d || !d.success) {
                    alert(d.message || "出错了，请重试！");
                    return;
                }

                if (data._id) {
                    alert("编辑成功！");
                }
                else {
                    alert("添加成功！");
                }
            }
        });
    });
});
