<?php
$databaseType = "MSSQL"; // 修改為 "MSSQL" 或 "Oracle"

// MSSQL 連接
if ($databaseType == "MSSQL") {
    //$serverName = "140.136.151.137\SQLEXPRESS"; // 移除多餘的單引號
    /*$connectionOptions = array(
        "Database" => "resturant",
        "Uid" => "abcde",
        "PWD" => "!QAZwsxedcrfvtgb"
    );*/
    $conn = sqlsrv_connect("localhost", "root", "", "resturant");

    if ($conn) {
        echo "MSSQL 連線成功！";
    } else {
        echo "MSSQL 連線失敗：" . print_r(sqlsrv_errors(), true);
    }
}
?>
