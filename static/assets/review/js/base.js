/*
 * @name: base.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2012-10-05
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.ready(function(S){
    var emailInput = S.one("#J_Email"),
        emailBtn = S.one("#J_EmailBtn"),
        emailForm = S.one("#J_EmailForm"),
        emailTemp;

    /*
     *emailInput && emailBtn && emailInput.on("valuechange", function(e){
     *    if (this.value && this.value.match(/^\w+[^@]*@[^@]+\.\w+$/)) emailBtn.show();
     *    else emailBtn.hide();
     *});
     */

    //emailInput && emailInput[0].focus();
    emailInput && emailInput.on("valuechange", function(e){
        if (!emailTemp) {
            emailTemp = S.one(S.DOM.create("<span>",{style:"alpha:0;color:#FFF;"}));
            S.one("body").append(emailTemp);
        }
        emailTemp.text(emailInput.val());
        emailInput.width(10 + emailTemp.width());

        if (this.value && this.value.match(/^\w+[^@]*@[^@]+\.\w+$/)) {
            emailInput.css({"color": "#0F790F"});
        }
        else {
            emailInput.css({"color": "#F00"});
        }
    }).on("focus", function(e){
        //emailInput.removeClass("cur");
        S.one("#J_InputTip").show();
    }).on("blur", function(e){
        
        if (emailTemp) {
            emailTemp.remove();
            emailTemp = null;
        }
    });

    emailForm && emailForm.on("submit", function(e){
        e.halt();
        if (emailInput && emailInput.val().match(/^\w+[^@]*@[^@]+\.\w+$/)) {
            emailForm[0].submit();
        }
    });

    var reSend = S.one("#J_ReSend"),
        wait = 60,
        reSending = false,
        clock;
    reSend && reSend.on("click", function(e){
        if (reSending) return;

        reSend.text("正在发送...");
        reSending = true;
        S.io({
            url: "/",
            data: {
                email: reSend.attr("data-email")
            },
            cache: false,
            type: "post",
            success: function(d) {
                reSending = false;
                if (d && d.success !== false) {
                    reSend.text("发送成功！" + wait-- + "秒后可重新发送");
                    reSending = true;
                    clock = S.later(function(){
                        if (wait > 0) {
                            reSend.text("发送成功！" + wait-- + "秒后可重新发送");
                        }
                        else {
                            reSend.text("没收到，重新发送！");
                            waith = 60;
                            reSending = false;
                            clock.cancel();
                        }
                    }, 1000, true);
                }
                else {
                    reSend.text("发送失败！请稍后重试");
                }
            },
            error: function(d) {
                reSend.text("发送失败！重新发送");
                reSending = false;
            }
        });
    });
});
