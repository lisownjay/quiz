/*
 * @name: question.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-04-07
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S) {
    var $ = S.all;

    $(".label").on("click", function(evt) {
        evt.halt();

        $(this).toggleClass("active");
    });

    // select
    $(document).delegate("click", ".question-chk", function(evt) {
        evt.halt();

        var el = S.one(evt.currentTarget),
            parent = el.parent(".question");

        parent.toggleClass("question-checked");
        el.prev().prop("checked", parent.hasClass("question-checked"));
    });

    // del
    $(document).delegate("click", ".qp-del", function(evt) {
        evt.halt();

        var el = S.one(evt.currentTarget),
            _id = el.attr("data-id");

        if (!_id) alert("删除失败，请刷新重试！");

        if (!window.confirm("确定要删除吗？")) return;

        S.io({
            url: "/io/question/del",
            type: "post",
            data: {
                _id: _id
            },
            complete: function(d) {
                if (!d || !d.success) {
                    alert("删除失败，请重试！");
                    return;
                }

                el.parent().parent().remove();
                alert("删除成功");
            }
        });
    });


    // quiz create
    $(document).delegate("click", "#J_QuizCreate", function(evt) {
        evt.halt();

        var el = S.one(evt.currentTarget),
            form = S.one("#J_ListForm");

        if (!form) return;

        S.io({
            url: "/io/quiz/create",
            form: form[0],
            type: "post",
            complete: function(d) {
                if (!d || !d.success) {
                    alert("失败，请重试！");
                    return;
                }

                alert("成功！")
            }
        });
    });

    // render list
    var tpl = S.one("#J_Template").html(),
        list = S.one("#J_List");

    if (!tpl || !list) return;

    S.use("xtemplate", function(S, XTemplate) {
        S.io({
            url: "/io/question",
            type: "get",
            complete: function(d) {
                if (!d || !d.success) {
                    alert("数据读取失败！请刷新重试！");
                    return;
                }

                list.html(new XTemplate(tpl).render({questions: d.docs}));
            }
        });
    });
});
