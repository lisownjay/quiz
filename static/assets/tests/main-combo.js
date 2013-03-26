/**
 *gen by sb
 *combo files:

/var/www/host/fed2/u/yanmu/fetest/question/mods/tool.js
/var/www/host/fed2/u/yanmu/fetest/question/mods/tpl_list.js
/var/www/host/fed2/u/yanmu/fetest/question/mods/main.js

*/
KISSY.add("tests/tool",function(S){
  return {
    filter:function(arr,filterObject){
      //debugger;
      var ret = S.filter(arr,function(item){
                  var flag = false;
                  S.each(filterObject,function(v,k){
                    if(item[k]){
                      if(S.isString(item[k])){
                        if(item[k].indexOf(v) > -1){
                          flag = true;
                        }
                      }else{
                        if(item[k] == v){
                          flag = true;
                        }
                      }
                    }
                  });
                  if(S.keys(filterObject).length == 0){
                    flag = true;
                  }
                  return flag;
                });
      return ret;
    },
    removeBy:function(arr,filterObject){
      S.each(arr,function(item,key){
        S.each(filterObject,function(filterItem,k){
          if(item[k] && item[k] == filterItem){
            arr.splice(key,1);
          }
        });
      });
    }
  };
});

;KISSY.add("tests/tpl_list",function(){
return ''+
    '{{#each docs as doc}}'
      + '<div class="span24 test-case">'
         // +'<h2 class="test-title ks-clear">'
         //   +'请编写一段JavaScript脚本生成下面这段DOM结构。要求：使用标准的DOM方法或属性. '
         // + '</h2>'
         +'<pre class="test-code">'
         + '{{doc.content}}'
         +'</pre>'
         +'<div class="test-info">'
             +'<label>'
             +'知识点: '
             + '</label>'
             +'<span>{{doc.skill}}</span>'
             +'<label>'
             +'难易程度: '
             + '</label>'
             +'<span>P{{doc.level}}</span>'
             +'<label>'
             +'耗时: '
             + '</label>'
             +'<span>{{doc.time}}分</span>'
             +'<span class="test-actions">'
             +'<a href="edit.html?id={{doc._id}}" class="J_Edit ks-button ks-button-primary" data-id="{{doc._id}}">编辑</a>  '
             +'<span class="J_Del ks-button ks-button-danger" data-id="{{doc._id}}">删除</span>'
             +'</span>'
        +'</div>'
      +'</div>'
  + '{{/each}}';
})
;KISSY.add("tests/main",function(S,Core,Template,Button,TPL_LIST,Tool){
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

