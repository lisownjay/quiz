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
    var nameInput = S.one("#J_Name"),
        mobileInput = S.one("#J_Mobile"),
        emailInput = S.one("#J_Email"),
        form = S.one("#J_Form"),
        inputTemp;


    //emailInput && emailInput[0].focus();
    emailInput && emailInput.on("valuechange", function(e){

        adjustInput(emailInput);

        if (this.value && this.value.match(/^\w+[^@]*@[^@]+\.\w+$/)) {
            emailInput.css({"color": "#0F790F"});
        }
        else {
            emailInput.css({"color": "#F00"});
        }
    });
    
    nameInput && nameInput.on("valuechange", function(e){
        adjustInput(nameInput);
    });

    mobileInput && mobileInput.on("valuechange", function(e){
        adjustInput(mobileInput);
    });

    S.all("#J_Name, #J_Mobile, #J_Email").on("focus", function(e){
        S.all("#J_InputTip").show();
    }).
    on("keydown", function(e) {
        if (e.keyCode !== 13) return;

        if (emailInput && emailInput.val().match(/^.+[^@]*@[^@]+\.\w+$/)) {
            form[0].submit();
        }
    });


    function adjustInput(input) {
        if (!inputTemp) {
            inputTemp = S.one(S.DOM.create("<span>",{style:"alpha:0;color:#FFF;"}));
            S.one("body").append(inputTemp);
        }
        inputTemp.text(input.val());
        input.width(10 + inputTemp.width());
    }

    form && form.on("submit", function(e){
        e.halt();
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
