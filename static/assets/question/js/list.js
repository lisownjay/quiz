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

    window._CACHE_ = null;
    window._FILTER_ = {
        "type": []
        , "skill": []
        , "level": []
    };

    $(".label").on("click", function(evt) {
        evt.halt();

        var el = $(this),
            type = el.attr("data-type"),
            tag = el.attr("data-tag");

        el.toggleClass("active");

        if (S.isUndefined(type) || S.isUndefined(tag)) return;

        tag = type != "skill" ? window.parseInt(tag, 10) : tag;

        if (el.hasClass("active")) {
            window._FILTER_[type].push(tag);
        }
        else {
            S.each(window._FILTER_[type], function(t, index) {
                if (t === tag) {
                    window._FILTER_[type].splice(index, 1);
                }
            });
        }

        filter(window._CACHE_);
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
                //alert("删除成功");
            }
        });
    });


    // quiz create
    $(document).delegate("click", "#J_QuizCreate", function(evt) {
        evt.halt();

        var el = S.one(evt.currentTarget),
            form = S.one("#J_ListForm");

        if (!form) return;

        var data = S.unparam(S.io.serialize(form[0]));

        if (!data.questions && !confirm("你没有选择题目，是否要随机生成？")) {
            return;
        }
        else if(!data.questions) {
            data.random = 1;
        }

        // for mongoose regexp query
        data.type = window._FILTER_.type.join("|");
        data.skill = window._FILTER_.skill.join("|");
        data.level = window._FILTER_.level.join("|");

        S.io({
            url: "/io/quiz/create",
            data: data,
            type: "post",
            timeout: 3,
            complete: function(d) {
                if (!d || !d.success) {
                    alert("失败，请重试！");
                    return;
                }

                if (d.doc && d.doc._id) {
                    window.top.location.href = "/quiz/" + d.doc._id;
                }
                else {
                    alert("生成考卷成功！");
                }
            }
        });
    });

    render();

    function render(data) {
        // render list
        var tpl = S.one("#J_Template").html(),
            list = S.one("#J_List");

        if (!tpl || !list) return;

        S.use("xtemplate", function(S, XTemplate) {
            if (data = data || window._CACHE_) {
                list.html(new XTemplate(tpl).render({questions: data}));
                return;
            }

            S.io({
                url: "/io/question",
                type: "get",
                cache: false,
                complete: function(d) {
                    if (!d || !d.success) {
                        alert("数据读取失败！请刷新重试！");
                        return;
                    }

                    window._CACHE_ = d.docs;

                    list.html(new XTemplate(tpl).render({questions: d.docs}));
                }
            });
        });
    }

    function filter(data) {
        var f = window._FILTER_,
            d = data.slice(0),
            ret = d;

        if (!f.type.length && !f.skill.length && !f.level.length) {
            render();
            return;
        }

        if (f.type.length) {
            ret = [];
            S.each(f.type, function(type) {
                S.each(d, function(q, index) {
                    if (q && q.type === type) {
                        ret.push(q);
                    }
                });
            });
        }

        if (f.level.length) {
            d = ret.slice(0);
            ret = [];
            S.each(f.level, function(level) {
                S.each(d, function(q, index) {
                    if (q && q.level === level) {
                        ret.push(q);
                    }
                });
            });
        }


        if (f.skill.length) {
            d = ret.slice(0);
            ret = [];
            S.each(f.skill, function(skill) {
                S.each(d, function(q, index) {
                    if (q && q.skill.indexOf(skill) >= 0) {
                        ret.push(q);
                    }
                });
            });
        }

        render(ret);
    }
});
