<?php
$dir = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']);
$loc = strripos($dir, '/api');
$path = substr($dir, 0, $loc)."/data/projects.json";

// get the file contents
$jsonobj = file_get_contents($path);
$final_res=json_encode($jsonobj);  // make sure format is json-compliant
echo $final_res;
?>