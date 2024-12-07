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

// Fetch tickets with pagination
$sqlTickets = "SELECT SQL_CALC_FOUND_ROWS `year`, `division`, `territory`, `group`, `category`, `buh`, `rm`, `am_name`, `prev_yr_sales`, `budget_2024`, `sales_ach`, `per_ach` FROM `target_summary` 
  WHERE $cond 
  LIMIT $offset, $limit";

// Execute the first query
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