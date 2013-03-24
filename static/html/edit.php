<?php 
   require_once('route.php');
?>
<!doctype html>
<html>
  <head>
	<meta charset="gbk">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="keywords" content="keyword1,keyword2,keyword3">
	<meta name="description" content="some sentences">
	<link rel="stylesheet" charset="utf-8" href="http://a.tbcdn.cn/s/kissy/1.3.0rc/??css/dpl/base-min.css,button/assets/dpl-min.css,/css/dpl/forms-min.css,css/dpl/labels-min.css">
	<link rel="stylesheet" href="mods/main.css" type="text/css" media="screen" />
	<title>题目</title>
  </head>
  <body>
	
    <div class="add-form-con">
	  <a class="ks-button add-test" href="list.php">返回列表页</a>	
	  <form id="test-form" class="form-horizontal" method="post" action="test.php">
        <h1 class="add-or-edit-test-title">
		  <?php 
			 if(isset($_GET['id'])){
			   echo "修改题目";
			 }else{
			   echo "添加题目";
			 }
		  ?>
		</h1>
        <div class="control-group">
		  <label class="control-label" for="test-title">题目:</label>
		  <div class="controls">
            <textarea name="content" class="input-xlarge" id="test-title" rows="8" style="width:400px"></textarea>
		  </div>
		  <p class="notice">
			如果需要显示图片，请以&lt;img src=&quot;xxxx&quot;/&gt;的特殊标签形式写入题目中。本地图片请先通过tps系统上传，获取图片地址后，替换对应的src即可。
		  </p>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">类型：</label>
		  <div class="controls test-type">
            <label class="radiobox">
			  <input class="test-type-ipt" type="radio" value="1" name="type">
			  选择题
            </label>
            <label class="radiobox">
			  <input class="test-type-ipt" type="radio" value="2" name="type" checked/>
			  编码题
            </label>
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">知识点：</label>
		  <div class="controls test-points">
            <label class="checkbox">
			  <input class="test-point" type="checkbox" value="html" name="skill"/>HTML
            </label>
		  </div>
		  <div class="controls test-points">
            <label class="checkbox">
			  <input class="test-point" type="checkbox" value="css" name="skill"/>CSS
            </label>
		  </div>
		  <div class="controls test-points">

            <label class="checkbox">
			  <input class="test-point" type="checkbox" value="javascript" name="skill"/>JavaScript
            </label>

		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="time-cost">耗时：</label>
		  <div class="controls">
            <input type="text" class="input-xlarge time-cost" id="time-cost" name="time">
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">难易程度：</label>
		  <div class="controls test-type">
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="1" name="level"/>
			  简单
            </label>
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="2" name="level"/>
			  中等
            </label>
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="3" name="level"/>
			  困难
            </label>
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="answer-area">答案及分析：</label>
		  <div class="controls">
            <textarea class="input-xlarge" name="remark" id="answer-area" rows="8" style="width:400px"></textarea>
		  </div>
        </div>


        <div class="control-group">
		  <label class="control-label" for="author">出题人：</label>
		  <div class="controls">
            <input type="text" name="author" class="input-xlarge author" id="author">
		  </div>
        </div>

        <div class="form-actions">
		  <button id="submit-form" class="ks-button ks-button-primary" type="submit">提交</button>
		  <button type="reset" class="ks-button">取消</button>
        </div>
	  </form>
    </div>
	
	<script charset="utf-8" src="http://a.tbcdn.cn/s/kissy/1.3.0rc/seed-min.js"></script>
	<script type="text/javascript">
	  //KISSY.Config.debug = true;
	  KISSY.config({packages:[{'name':"mods",path:'./',charset:'utf-8'}]});

	  var FETEST_API_HOST = 'http://10.13.181.195:8888';

	  var FETEST_API = {
	    read:FETEST_API_HOST+'/io/question',
	    create:FETEST_API_HOST+'/io/question/create',
	    update:FETEST_API_HOST+'/io/question/update',
	    test_id:<?php $id = $_GET['id'] ? '"'.$_GET['id'].'"' : '""';echo $id?>

	  };

	  KISSY.use('mods/edit',function(S,Edit){
	    Edit.init && Edit.init();
	  });
	</script>
  </body>
</html>





