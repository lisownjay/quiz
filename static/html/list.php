<?php
require_once('route.php');
?>
<!doctype html>
<html>
  <head>
	<meta charset="gbk">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<link rel="stylesheet" charset="utf-8" href="http://a.tbcdn.cn/s/kissy/1.3.0rc/??css/dpl/base-min.css,button/assets/dpl-min.css,css/dpl/labels-min.css">
	<link rel="stylesheet" href="./mods/main.css" type="text/css" media="screen" />
	<title>��Ŀ�б�</title>
  </head>
  <body>
    <div class="container" id="J_Tags">
		<div class="row hd">
		  <h1 class="span24 tags">
			Tags:
			<a class="label label-info" href="javascript:void(0);">����</a>
			<a class="label label-info" data-param='{"type":1}' href="javascript:void(0);">ѡ����</a>
			<a class="label label-info" data-param='{"type":2}' href="javascript:void(0);">������</a>
			<a class="label label-js" data-param='{"skill":"javascript"}' href="javascript:void(0);">JavaScript</a>
			<a class="label label-html" data-param='{"skill":"html"}' href="javascript:void(0);">HTML</a>
			<a class="label label-css" data-param='{"skill":"css"}' href="javascript:void(0);">CSS</a>
			<a class="label label-stage-c" data-param='{"level":1}' href="javascript:void(0);">��</a>
			<a class="label label-stage-b" data-param='{"level":2}' href="javascript:void(0);">�е�</a>
			<a class="label label-stage-a" data-param='{"level":3}' href="javascript:void(0);">����</a>
			
		  </h1>
		  <a class="ks-button add-test" href="edit.php">�����Ŀ</a>		  
		</div>
        <div id="J_TestCases" class="test-cases ks-clear loading-cases">
		  <?php /* for($i=0;$i<3;$i++){ ?>
		  <div class="span24 test-case">
			<!-- <h2 class="test-title ks-clear"> -->
			<!--   ���дһ��JavaScript�ű������������DOM�ṹ��Ҫ��ʹ�ñ�׼��DOM����������. -->
			<!-- </h2> -->
			<pre class="test-code">
  ���дһ��JavaScript�ű������������DOM�ṹ��Ҫ��ʹ�ñ�׼��DOM����������.
 
  &lt;div id=&quot;exp&quot;&gt;
  &lt;p class=&quot;slogon&quot;&gt;&#x6dd8;&#xff01;&#x4f60;&#x559c;&#x6b22;&lt;/p&gt;
  &lt;/div&gt;

			</pre>
			<div class="test-info">
			  <label>
				֪ʶ��:
			  </label>
			  <span>JavaScript</span>
			  <label>
				���׳̶�:
			  </label>
			  <span>��</span>
			  <label>
				��ʱ:
			  </label>
			  <span>10��</span>
			  <span class="test-actions">
				<span class="ks-button ks-button-primary" data-action="edit">�༭</span>
				<span class="ks-button ks-button-danger" data-action="del">ɾ��</span>
			  </span>
			</div>
		  </div>
		  <?php } */ ?>
        </div>
    </div>
	
	<script charset="utf-8" src="http://a.tbcdn.cn/s/kissy/1.3.0rc/seed-min.js"></script>
	<script type="text/javascript">
	  var FETEST_API_HOST = 'http://10.13.181.195:8888/';

	  var FETEST_API = {
	    list:FETEST_API_HOST+'io/question',
	    delete:FETEST_API_HOST+'/io/question/del'
	  };

	  //KISSY.Config.debug = true;
	  KISSY.config({packages:[{'name':"mods",path:'./',charset:'utf-8'}]});
	  KISSY.use('mods/main',function(S,Main){
	    Main && Main.init();
	  });

	</script>
  </body>
</html>





