KISSY.add("mods/edit",function(e,t){var n=e.Template,r=e.DOM,i={init:function(){this.$form=e.one("#test-form"),this.$submitBtn=this.$form.one("#submit-form"),this.$content=this.$form.one("#test-title"),this.$types=this.$form.all(".test-type-ipt"),this.$levels=this.$form.all(".test-level-ipt"),this.$skills=this.$form.all(".test-point"),this.$time=this.$form.one("#time-cost"),this.$remark=this.$form.one("#answer-area"),this.$author=this.$form.one("#author"),this.$proccessingMsg=null,this.proccessingTimer=null,this.proccessingTimerHide=null,this.editMode=!!FETEST_API&&!!FETEST_API.test_id,this.getFormData(),this.initialProccessingMsg(),this.bindEvent()},bindEvent:function(){this.$submitBtn.on("click",this.onFormSubmit,this)},getFormData:function(){var t=this;FETEST_API.test_id?(this.showProcessingMsg("\u83b7\u53d6\u6570\u636e...",3e3),e.io({cache:!1,dataType:"json",type:"get",url:FETEST_API.read+"/"+FETEST_API.test_id,timeout:1e4,success:function(e){e.success?(t.renderForm(e),t.clearShowProcessingMsgTimer(),t.hideProcessingMsg()):t.showProcessingMsg("error occurred:"+e.message)},error:function(){t.showProcessingMsg("error occurred")},complete:function(){}})):t.setFormDefaultValue()},renderForm:function(e){var t=e.docs&&e.docs.length&&e.docs[0];if(t){this.$content.val(t.content||""),this.$time.val(t.time||""),this.$author.val(t.author||""),this.$remark.val(t.remark||"");switch(t.type){case 1:this.$types.item(0).attr("checked",!0);break;case 2:this.$types.item(1).attr("checked",!0)}switch(t.level){case 1:this.$levels.item(0).attr("checked",!0);break;case 2:this.$levels.item(1).attr("checked",!0);break;case 3:this.$levels.item(2).attr("checked",!0)}t.skill&&(t.skill.indexOf("css")>-1&&this.$skills.item(1).attr("checked",!0),t.skill.indexOf("javascript")>-1&&this.$skills.item(2).attr("checked",!0),t.skill.indexOf("html")>-1&&this.$skills.item(0).attr("checked",!0))}},initialProccessingMsg:function(){var t=r.create('<div class="processing-msg"><span id="J_ProcessMsg" class="label label-info"></span></div>');r.css(t,{width:"100%",display:"none",textAlign:"center",position:"fixed",top:0}),r.appendTo(t,document.body),this.$proccessingMsg=e.Node(r.get("#J_ProcessMsg",t)),this.$proccessingMsgCon=e.Node(t)},onFormSubmit:function(t){t.halt();var n=this,r=this.editMode?FETEST_API.update:FETEST_API.create,i=this.editMode?"\u66f4\u65b0\u6210\u529f!":"\u4fdd\u5b58\u6210\u529f!",s=this.editMode?{_id:FETEST_API.test_id}:{};this.showProcessingMsg("\u6b63\u5728\u4fdd\u5b58...",2e3),e.io({cache:!1,dataType:"json",type:"post",url:r,data:s,form:"#test-form",timeout:1e4,success:function(e){e.success?(n.showProcessingMsg(i,0),!n.editMode&&(n.resetForm(),n.setFormDefaultValue())):n.showProcessingMsg("error occurred:"+e.message)},error:function(){n.showProcessingMsg("error occurred")},complete:function(){}})},resetForm:function(){this.$form[0].reset()},setFormDefaultValue:function(){this.$author.val("2012\u6821\u62db\u9898")},showProcessingMsg:function(e,t){typeof t==undefined&&(t=0);var n=this;this.clearShowProcessingMsgTimer(),n.proccessingTimer=setTimeout(function(){n.$proccessingMsg.html(e),n.fadeIn(n.$proccessingMsgCon,function(){n.proccessingTimerHide=setTimeout(function(){n.hideProcessingMsg()},2e3)})},t)},hideProcessingMsg:function(){this.fadeOut(this.$proccessingMsgCon)},isEditMode:function(){return FETEST_API&&FETEST_API.test_id},clearShowProcessingMsgTimer:function(e){this.proccessingTimer&&clearTimeout(this.proccessingTimer),this.proccessingTimerHide&&clearTimeout(this.proccessingTimerHide),delete this.proccessingTimer,delete this.proccessingTimerHide},fadeOut:function(t,n){var i=new e.Anim(t,{opacity:0});i.on("complete",function(){r.hide(t),n&&n()}),i.run()},fadeIn:function(t,n){r.show(t),r.css(t,"opacity",1);var i=new e.Anim(t,{opacity:1});i.on("complete",function(){n&&n()}),i.run()}};return i},{requires:["core","template"]})