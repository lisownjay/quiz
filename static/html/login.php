<?php
session_start();
/*
echo "<pre>";
print_r($_SERVER);

echo $_SERVER['HTTP_REFERER'];
echo $_SERVER['HTTP_REFERER'];
echo 'login';
*/
$path = $_COOKIE['path'] ? $_COOKIE['path'] : "list.php";

//print_r($_POST);
//if($_POST['name']){
//if($_POST['name'] == 'chromeffopie' && $_POST['pwd'] == "123456"){
if($_POST['name'] == "tbued" && $_POST['pwd'] == "taobao1234"){
   //尼玛，不支持session
   setcookie('login',1,time()+3600*2);
   //echo $_SESSION['login'];
   header("Location:".$path);
}

?>

<html>
  <head>
	<meta charset="gbk">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="keywords" content="keyword1,keyword2,keyword3">
	<meta name="description" content="some sentences">
	<link rel="stylesheet" charset="utf-8" href="http://a.tbcdn.cn/s/kissy/1.3.0rc/??css/dpl/base-min.css,button/assets/dpl-min.css,/css/dpl/forms-min.css,css/dpl/labels-min.css">
	<link rel="stylesheet" href="mods/main.css" type="text/css" media="screen" />
	<title>登陆</title>
  </head>
  <body>
	
    <div class="add-form-con login-form">
	  <form class="form-horizontal" method="post" action="login.php">
        <div class="control-group">
		  <label class="control-label" for="name">用户名：</label>
		  <div class="controls">
            <input type="text" name="name" id="name" class="input-xlarge author">
		  </div>
        </div>

        <div class="control-group">
		  <label class="control-label" for="pwd">密码：</label>
		  <div class="controls">
            <input type="password" name="pwd" id="pwd" class="input-xlarge author">
		  </div>
        </div>

        <div class="form-actions">
		  <button id="submit-form" class="ks-button ks-button-primary" type="submit">登陆</button>
		  <button type="reset" class="ks-button">重置</button>
        </div>
	  </form>
    </div>
	
	<script charset="utf-8" src="http://a.tbcdn.cn/s/kissy/1.3.0rc/seed-min.js"></script>
	<script type="text/javascript">
	  KISSY.Config.debug = true;
	  KISSY.config({packages:[{'name':"mods",path:'./',charset:'utf-8'}]});
	</script>
  </body>
</html>





