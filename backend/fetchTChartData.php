<?php
include 'config.php';
$fieldToGroupBy = isset($_GET['field']) ? $_GET['field'] : 'year';
$sql = "SELECT $fieldToGroupBy, COUNT(`year`) as count FROM target_summary GROUP BY $fieldToGroupBy";

$result = $conn->query($sql);
$chartData = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    $chartData[] = $row;
  }
}
echo json_encode(['chartData' => $chartData]);
?>