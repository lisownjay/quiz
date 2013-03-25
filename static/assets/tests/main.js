KISSY.add(function(S,Core,Template,Button,TPL_LIST,Tool){
  var D = S.DOM;
  var Main = {
    init:function(){
      this.template_list = Template(TPL_LIST);
      this.$listContainer = S.one('#J_TestCases');
      this.$tags = S.one('#J_Tags');
      this.allData = null;//所有题目数据

      this.renderLists();
      this.bindEvent();
    },
    bindEvent:function(){
      this.$listContainer.delegate('click','.J_Edit',this.editHandle,this);
      this.$listContainer.delegate('click','.J_Del',this.delHandle,this);
      this.$tags.delegate('click','.label',this.tagHandle,this);
    },
    editHandle:function(e){

    },
    tagHandle:function(e){
      e.halt();
      var el = e.currentTarget,
          param = D.attr(el,'data-param');
      if(param){
        param = S.JSON.parse(param);
      }else{
        param = {};
      }
      this.$listContainer.html('');
      this.showLoading();
      this.filterData(param);
    },
    filterData:function(o){
      if(this.allData){
        var docs = Tool.filter(this.allData.docs,o);
        this.renderList(docs);
      }
    },
    delHandle:function(e){
      var c = confirm('确定要删除?');

      if(!c){
        return;
      }

      var that = this,
          el = e.currentTarget,
          item = D.parent(el,'.test-case'),
          id = D.attr(el,'data-id');
      S.io({
        cache:false,
        dataType:'json',
        data:{
          _id:id
        },
        type:'post',
        url:FETEST_API.delete,
        timeout:10000,
        success:function(data){
          // if(data.success){}
          if(data.success){
            that.delTestCase(item);
            id && Tool.removeBy(that.allData.docs,{"_id":id});
          }else{
            alert('删除失败'+data.message);
          }
        },
        error:function(){
          alert('error');
        },
        complete:function(){

        }
      });
    },
    delTestCase:function(el){
      if(!el)return;
      var anim = S.Anim(el,{
        height:0
      },.3);
      anim.on('complete',function(){
        D.remove(el);
      });
      anim.run();
    },
    renderLists:function(){
      this.getData();
    },
    getData:function(param){
      var that = this;
      param = param || {};
      S.io({
        cache:false,
        dataType:'json',
        data:param,
        type:'get',
        // url:'test.php',
        url:FETEST_API.list,
        timeout:10000,
        success:function(data){
          if(data.success){
            that.allData = data;
            that.renderList(data.docs);
          }else{
            alert('err:'+data.message);
          }
        },
        error:function(){
          alert('error');
        },
        complete:function(){

        }
      });
    },
    renderList:function(docs){
      if(docs && docs.length){
        var html = this.template_list.render({docs:docs});
        this.hideLoading();
        this.$listContainer.css('display','none');
        this.$listContainer.html(html);
        this.$listContainer.fadeIn();
      }else{
        this.hideLoading();
        this.showNoResult()
      }
    },
    hideLoading:function(){
      this.$listContainer.removeClass('loading-cases');
    },
    showLoading:function(){
      this.$listContainer.addClass('loading-cases');
    },
    showNoResult:function(){
      this.$listContainer.html('没有题目');
    }
  }


  return Main;

},{requires:['core','template','button','./tpl_list','./tool']});

