/*
 * @name: list.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-31
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S){
    function render(data) {
        // render list
        var tpl = S.one("#J_Template").html(),
            list = S.one("#J_List");

        if (!tpl || !list) return;

        S.use("xtemplate", function(S, XTemplate) {
            if (data = data || window._CACHE_) {
                list.html(new XTemplate(tpl).render({quizs: data}));
                return;
            }

            S.io({
                url: "/io/quiz",
                type: "get",
                cache: false,
                complete: function(d) {
                    if (!d || !d.success) {
                        alert("数据读取失败！请刷新重试！");
                        return;
                    }

                    window._CACHE_ = d.docs;

                    list.html(new XTemplate(tpl).render({quizs: d.docs}));
                }
            });
        });
    }

    render();

    S.use("quiz/email", function(S, Email) {
        S.one(document).delegate("click", ".btn-send", function(e){
            e.halt();
            var el = S.all(e.currentTarget),
                email = prompt("请输入email:") || "";

            if (!email.match(/[-\w\.]+@\w+(?:(?:\.\w+)+)$/)) {
                alert("email格式错误!");
                return;
            }

            Email({
                _id: el.attr("data-i"),
                email: email,
                complete: function(d) {
                    if (!d.success) {
                        alert("发送失败，请重试！");
                    }
                    else {
                        alert("发送成功！");
                    }
                }
            });
        });
    });
});
