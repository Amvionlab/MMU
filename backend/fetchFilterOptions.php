<?php
include 'config.php';
$field = $_GET['field'];
$sql = "SELECT DISTINCT $field FROM sales_summary ORDER BY $field";

$result = $conn->query($sql);
$filterOptions = [];
if ($result && $result->num_rows > 0) {
  while ($row = $result->fetch_assoc()) {
    if ($row[$field]) {
      $filterOptions[] = $row[$field];
    }
  }
}
echo json_encode(['options' => $filterOptions]);
?>