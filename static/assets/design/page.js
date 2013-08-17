KISSY.ready(function(S){
    var isPass =[];
    S.all('#login-wrap .input-field').each(function(){
        var t = S.one(this);
        if(!t.attr('data-default')){
            t.attr('data-default', t.val());
        }
    });
    S.all('#login-wrap .input-field').on('focusin', function(e){
        var t = S.one(e.target);
        if(t.hasClass('default')){
            t.val('').removeClass('default');
        }
    }).on('focusout', function(e){
            var t = S.one(e.target);
            var type = t.attr('data-tag');
            if(!t.val() || t.val() == t.attr('data-default')){
                t.addClass('default').val(t.attr('data-default'));
                showMsg(t.parent(), "此项为必填项");
                return;
            }else if(type === 'tel'){
                if(!/^13[0-9]{9}$/.test(t.val())){
                    showMsg(t.parent(), "电话格式不正确");
                    return;
                }
            }else if(type === 'email'){
                if(!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(t.val())){
                    showMsg(t.parent(), "Email格式错误");
                    return;
                }
            }
            isPass.push(true);
            if(t.next())
                t.next().hide();
            return;
        });
    S.one('#btn-submit').on('click', function(e){
        var t = S.one(e.target);
        isPass = [];
        S.Event.fire('#login-wrap .input-field','focusout')
        if(isPass.length != 3 || isPass.indexOf(false) != -1)
            e.preventDefault();
    });
    function showMsg(parent, msg){
        var msgBox = parent.one('.ui-msg');
        if(!msgBox){
            var msgTemplate = '<div class="ui-msg"><div class="ui-msg-con ui-msg-error"><em class="label">{msg}</em><s class="ui-msg-icon"></s></div><s class="ui-msg-arrow"></s></div>';
            var msgHtml = KISSY.substitute(msgTemplate,{msg:msg});
            parent.append(msgHtml);
        }else{
            msgBox.one('.label').text(msg).end().show();
        }
    }
});