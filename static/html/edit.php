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
	<title>��Ŀ</title>
  </head>
  <body>
	
    <div class="add-form-con">
	  <a class="ks-button add-test" href="list.php">�����б�ҳ</a>	
	  <form id="test-form" class="form-horizontal" method="post" action="test.php">
        <h1 class="add-or-edit-test-title">
		  <?php 
			 if(isset($_GET['id'])){
			   echo "�޸���Ŀ";
			 }else{
			   echo "�����Ŀ";
			 }
		  ?>
		</h1>
        <div class="control-group">
		  <label class="control-label" for="test-title">��Ŀ:</label>
		  <div class="controls">
            <textarea name="content" class="input-xlarge" id="test-title" rows="8" style="width:400px"></textarea>
		  </div>
		  <p class="notice">
			�����Ҫ��ʾͼƬ������&lt;img src=&quot;xxxx&quot;/&gt;�������ǩ��ʽд����Ŀ�С�����ͼƬ����ͨ��tpsϵͳ�ϴ�����ȡͼƬ��ַ���滻��Ӧ��src���ɡ�
		  </p>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">���ͣ�</label>
		  <div class="controls test-type">
            <label class="radiobox">
			  <input class="test-type-ipt" type="radio" value="1" name="type">
			  ѡ����
            </label>
            <label class="radiobox">
			  <input class="test-type-ipt" type="radio" value="2" name="type" checked/>
			  ������
            </label>
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">֪ʶ�㣺</label>
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
		  <label class="control-label" for="time-cost">��ʱ��</label>
		  <div class="controls">
            <input type="text" class="input-xlarge time-cost" id="time-cost" name="time">
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="optionsCheckbox">���׳̶ȣ�</label>
		  <div class="controls test-type">
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="1" name="level"/>
			  ��
            </label>
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="2" name="level"/>
			  �е�
            </label>
            <label class="radiobox">
			  <input class="test-level-ipt" type="radio" value="3" name="level"/>
			  ����
            </label>
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="answer-area">�𰸼�������</label>
		  <div class="controls">
            <textarea class="input-xlarge" name="remark" id="answer-area" rows="8" style="width:400px"></textarea>
		  </div>
        </div>


        <div class="control-group">
		  <label class="control-label" for="author">�����ˣ�</label>
		  <div class="controls">
            <input type="text" name="author" class="input-xlarge author" id="author">
		  </div>
        </div>

        <div class="form-actions">
		  <button id="submit-form" class="ks-button ks-button-primary" type="submit">�ύ</button>
		  <button type="reset" class="ks-button">ȡ��</button>
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





