<?php
$severName = "WIN-SQL5CNC3OSL\SQLEXPRESS";
$database = "resturant";
$uid = "sa";
$password = "!QAZwsxedcrfvtgb";

$connection = [
"Database" => $database,
"uid" => $uid,
"PWD" => $password
];

$conn = sqlsrv_connect($severName, $connection);
if(!$conn){
  die(print_r(sqlsrv_errors(), true));
}else{
  echo "connection established";
}

?>