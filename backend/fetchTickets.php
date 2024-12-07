<?php 
include 'config.php'; 


$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 50;
$offset = ($page - 1) * $limit;

$cond = "1=1";
if (isset($_GET['user'])) {
    $id = intval($_GET['user']);
    $cond = "ticket.created_by = $id";
}
if (isset($_GET['support'])) {
    $id = intval($_GET['support']);
    $cond = "(FIND_IN_SET($id, ticket.assignees) OR ticket.created_by = $id)";
}

if (isset($_GET['filters'])) {
  $filters = $_GET['filters'];
  $cond .= " AND " . $filters; 
}


$sqlTickets = "SELECT SQL_CALC_FOUND_ROWS `month`, `date_invoiced`, `document_no`, `bpartner_group`, 
  `business_partner`, `prod_value`, `prod_name`, `invoiced_qty`, `line_amt`, `sales_in_lacs`,
  `product_category`, `product_group`, `state`, `zone`, `division`, `am`, 
  `territory`, `rm`, `buh`, `product_mapping`, `product_type`, `sap_code`, 
  `product_grouping`, `vendor_name`, `parameter_sap`, `brand`, `product_division`, 
  `document`, `revenue_account`, `cogs_account`, `year`, `customer_po_num`, 
  `mapping_code`, `euroimmun_top_product`, `pack_size`, `aop_2024_mapping`, 
  `territory_2023`, `buh_2023` 
  FROM `sales_summary` 
  WHERE $cond 
  LIMIT $offset, $limit";

$result = $conn->query($sqlTickets);

// Fetch the total count of the found rows in a separate query
$countResult = $conn->query("SELECT FOUND_ROWS() AS total_count");

// Check if the ticket query returned any results
if ($result && $result->num_rows > 0) {
  $tickets = [];
  while ($row = $result->fetch_assoc()) {
    $tickets[] = $row;
  }

  // Fetch total count
  $totalCount = $countResult ? $countResult->fetch_assoc()['total_count'] : 0;

  echo json_encode(['tickets' => $tickets, 'total' => $totalCount]);
} else {
  echo json_encode(array("message" => "No tickets found", "total" => 0));
} // Get total count for pagination


?>