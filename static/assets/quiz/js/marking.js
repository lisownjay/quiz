/*
 * @name: marking.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-08-15
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S){
    var markingFix = S.one("#J_MarkingFix"),
        btnToggle = S.one(".btn-toggle"),
        btnMarking = S.one("#J_Marking");

    if (markingFix && btnToggle && btnMarking) {
        S.all(".btn-toggle, .label-toggle").on("click", function(e) {
            var el = S.one(e.currentTarget);

            if (markingFix.data("expand")) {
                markingFix.css({"right": -280}).data("expand", false);
                btnToggle.text("<<");
            }
            else {
                markingFix.css({"right": 0}).data("expand", true);
                btnToggle.text(">>");
            }
        });

        btnMarking.on("click", function(e) {
            btnMarking.text("正在提交...").prop("disabled", true);
            S.io({
                url: "/io/quiz/update/" + btnMarking.attr("data-i"),
                data: {
                    score: S.all("#J_Score").val()
                    ,remark: S.all("#J_Remark").val()
                },
                type: "post",
                complete: function(d) {
                    if (d && d.success) {
                        btnMarking.text("提交成功！");
                    }
                    else {
                        btnMarking.text("提交失败！");
                    }

                    S.later(function(){
                        btnMarking.text("确　定").prop("disabled", false);
                    }, 1000);
                }
            });
        });
    }
});
