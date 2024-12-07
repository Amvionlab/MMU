<?php
include 'config.php';

$cond = "WHERE 1=1";

if (isset($_GET['filters'])) {
    $filters = $_GET['filters'];
    $cond .= " AND " . $filters; // Adjust condition to include the filters
}

// Main query to fetch the grouped chart data
$fieldToGroupBy = isset($_GET['field']) ? $_GET['field'] : 'bpartner_group';
$sql = "SELECT $fieldToGroupBy, 
               COUNT(`month`) AS count, 
               SUM(`sales_in_lacs`) AS salessum 
        FROM sales_summary $cond 
        GROUP BY $fieldToGroupBy";

$result = $conn->query($sql);
$chartData = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $chartData[] = $row;
    }
}

// Additional query to get the total sums without grouping
$sumQuery = "SELECT 
              SUM(`invoiced_qty`) AS total_invoiced_qty, 
              SUM(`line_amt`) AS total_line_amt, 
              SUM(`sales_in_lacs`) AS total_sales_in_lacs, 
              SUM(`pack_size`) AS total_pack_size 
              FROM sales_summary $cond";

$sumResult = $conn->query($sumQuery);
$sums = $sumResult ? $sumResult->fetch_assoc() : [];

echo json_encode(['chartData' => $chartData, 'sums' => $sums]);
?>