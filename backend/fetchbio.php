<?php
include 'config.php';
echo json_encode([
    [ "EmployeeCode" => "1", "LogDateTime" => "2024-12-24 16:23:22", "DownLoadDateTime" => "2024-12-26 11:38:01", "Direction" => "in" ],
    [ "EmployeeCode" => "2", "LogDateTime" => "2024-12-25 15:47:18", "DownLoadDateTime" => "2024-12-25 18:57:43", "Direction" => "in"],
    [ "EmployeeCode" => "401", "LogDateTime" => "2024-12-29 12:22:25", "DownLoadDateTime" => "2024-12-29 12:22:29", "Direction" => "in"],
    [ "EmployeeCode" => "501", "LogDateTime" => "2024-12-29 12:33:06", "DownLoadDateTime" => "2024-12-29 12:33:09", "Direction" => "in" ]
]);
?>