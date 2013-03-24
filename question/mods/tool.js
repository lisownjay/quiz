KISSY.add(function(S){
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

