KISSY.add(function(S,Core){
  var Template = S.Template,
      D = S.DOM;

  var Edit = {
    init:function(){
      this.$form = S.one('#test-form');
      this.$submitBtn = this.$form.one('#submit-form');
      this.$content = this.$form.one('#test-title');
      this.$types = this.$form.all('.test-type-ipt');
      this.$levels = this.$form.all('.test-level-ipt');
      this.$skills = this.$form.all('.test-point');
      this.$time = this.$form.one('#time-cost');
      this.$remark = this.$form.one('#answer-area');
      this.$author = this.$form.one('#author');

      this.$proccessingMsg = null;//提示信息条
      this.proccessingTimer = null;//提示信息的延时句柄
      this.proccessingTimerHide = null;//提示信息的延时句柄

      this.editMode = !!(FETEST_API && FETEST_API.test_id);

      this.getFormData();
      this.initialProccessingMsg();
      this.bindEvent();
    },
    bindEvent:function(){
      // this.$form.on('submit',this.onFormSubmit,this);
      this.$submitBtn.on('click',this.onFormSubmit,this);
    },
    getFormData:function(){
      var that = this;
      if(FETEST_API.test_id){
        this.showProcessingMsg('获取数据...',3000);
        S.io({
          cache:false,
          dataType:'json',
          type:'get',
          url:FETEST_API.read+'/'+FETEST_API.test_id,
          timeout:10000,
          success:function(data){
            if(data.success){
              that.renderForm(data);
              that.clearShowProcessingMsgTimer();
              that.hideProcessingMsg();
            }else{
              that.showProcessingMsg('error occurred:'+data.message);
            }
          },
          error:function(){
            that.showProcessingMsg('error occurred');
          },
          complete:function(){

          }
        });
      }else{
        //设定默认值
        that.setFormDefaultValue();
      }
    },
    renderForm:function(data){
      var doc = data.docs && data.docs.length && data.docs[0];
      if(doc){
        this.$content.val(doc.content||'');
        this.$time.val(doc.time||'');
        this.$author.val(doc.author||'');
        this.$remark.val(doc.remark||'');

        switch (doc.type){
          case 1:
          this.$types.item(0).attr('checked',true);break;
          case 2:
          this.$types.item(1).attr('checked',true);break;
        }

        switch (doc.level){
          case 1:
          this.$levels.item(0).attr('checked',true);break;
          case 2:
          this.$levels.item(1).attr('checked',true);break;
          case 3:
          this.$levels.item(2).attr('checked',true);break;
        }

        if(doc.skill){
          doc.skill.indexOf('css') > -1 && this.$skills.item(1).attr('checked',true)
          doc.skill.indexOf('javascript') > -1 && this.$skills.item(2).attr('checked',true)
          doc.skill.indexOf('html') > -1 && this.$skills.item(0).attr('checked',true)
        }
      }else{

      }
    },
    initialProccessingMsg:function(){
      var $con = D.create('<div class="processing-msg"><span id="J_ProcessMsg" class="label label-info"></span></div>');
      D.css($con,{
        width:'100%',
        display:'none',
        textAlign:'center',
        position:'fixed',
        top:0
      });
      D.appendTo($con,document.body);
      this.$proccessingMsg = S.Node(D.get('#J_ProcessMsg',$con));
      this.$proccessingMsgCon = S.Node($con);
    },
    onFormSubmit:function(e){
      e.halt();
      var that = this;
      var api = this.editMode ? FETEST_API.update:FETEST_API.create;

      var msg = this.editMode ? "更新成功!":"保存成功!";

      var data = this.editMode ? {"_id":FETEST_API.test_id}:{};

      this.showProcessingMsg('正在保存...',2000);
      S.io({
        cache:false,
        dataType:'json',
        type:'post',
        // url:'test.php',
        url:api,
        data:data,
        form:'#test-form',
        timeout:10000,
        success:function(data){
          if(data.success){
            that.showProcessingMsg(msg,0);
            //保存成功后重置form
            !that.editMode && (that.resetForm(),that.setFormDefaultValue());

            // !that.editMode && (FETEST_API.test_id = data.id);
            // 保存成功后进入编辑模式？
            //that.editMode = 1;
          }else{
            that.showProcessingMsg('error occurred:'+data.message);
          }
        },
        error:function(){
          that.showProcessingMsg('error occurred');
        },
        complete:function(){

        }
      });
    },
    resetForm:function(){
      this.$form[0].reset();
    },
    setFormDefaultValue:function(){
        this.$author.val('2012校招题');
    },
    showProcessingMsg:function(msg,interval){
      typeof interval == undefined && (interval = 0);
      var that = this;
      this.clearShowProcessingMsgTimer();
      that.proccessingTimer = setTimeout(function(){
                                that.$proccessingMsg.html(msg);
                                that.fadeIn(that.$proccessingMsgCon,function(){
                                  that.proccessingTimerHide = setTimeout(function(){
                                                                that.hideProcessingMsg();
                                                              },2000);
                                });
                              },interval);
    },
    hideProcessingMsg:function(){
      this.fadeOut(this.$proccessingMsgCon);
    },
    isEditMode:function(){
      return FETEST_API && FETEST_API.test_id;
    },
    clearShowProcessingMsgTimer:function(cb){
      this.proccessingTimer && clearTimeout(this.proccessingTimer);
      this.proccessingTimerHide && clearTimeout(this.proccessingTimerHide);
      delete this.proccessingTimer;
      delete this.proccessingTimerHide;
    },
    fadeOut:function(el,cb){
      var anim = new S.Anim(el,{
        opacity:0
      });
      anim.on('complete',function(){
        D.hide(el);
        cb && cb();
      });
      anim.run();
    },
    fadeIn:function(el,cb){
      D.show(el);
      D.css(el,'opacity',1);
      var anim = new S.Anim(el,{
        opacity:1
      });
      anim.on('complete',function(){
        cb && cb();
      });
      anim.run();
    }
  };
  return Edit;
},{
  requires:['core','template']
});

