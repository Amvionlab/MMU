<?php
include 'config1.php';

// Query to fetch data
$sql = "SELECT * FROM Parallel";
$stmt = sqlsrv_query($conn, $sql);

$users = [];
if ($stmt) {
    while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        $users[] = $row;
    }
    sqlsrv_free_stmt($stmt);
}

sqlsrv_close($conn);

// Return JSON response
echo json_encode($users);
?>
