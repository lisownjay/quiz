<?php
if($_COOKIE['login'] != 1){
  header('Location:login.php');
}
setcookie("path",$_SERVER['SCRIPT_URI'], time()+3600);  /* expire in 1 hour */
?>
