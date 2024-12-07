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
$sqlTickets = "SELECT SQL_CALC_FOUND_ROWS  `Year`, `division`, `territory`, `buh`, `rm`, `am name`, `prev ins act`, `prev reag act`, `prev yr total`, `ins tgt`, `ins act`, `ins ach per`, `ins growth per`, `reag tgt`, `reag ach`, `reag ach per`, `reag growth per`, `curr yr total tgt`, `curr yr total ach`, `curr yr total ach per`, `curr yr growth per`, `Jan_Ins_LYS`, `Jan_Ins_Tgt`, `Jan_Ins_Act`, `Jan_Ins_Act_Per`, `Jan_Ins_Growth_Per`, `Jan_Reag_LYS`, `Jan_Reag_Tgt`, `Jan_Reag_Act`, `Jan_Reag_Act_Per`, `Jan_Reag_Growth_Per`, `Jan Total LYS`, `Jan Total Tgt`, `Jan Total Act`, `Jan Ach Per`, `Jan Growth Per`, `Feb_Ins_LYS`, `Feb_Ins_Tgt`, `Feb_Ins_Act`, `Feb_Ins_Act_Per`, `Feb_Ins_Growth_Per`, `Feb_Reag_LYS`, `Feb_Reag_Tgt`, `Feb_Reag_Act`, `Feb_Reag_Act_Per`, `Feb_Reag_Growth_Per`, `Feb Total LYS`, `Feb Total Tgt`, `Feb Total Act`, `Feb Ach Per`, `Feb Growth Per`, `Mar_Ins_LYS`, `Mar_Ins_Tgt`, `Mar_Ins_Act`, `Mar_Ins_Act_Per`, `Mar_Ins_Growth_Per`, `Mar_Reag_LYS`, `Mar_Reag_Tgt`, `Mar_Reag_Act`, `Mar_Reag_Act_Per`, `Mar_Reag_Growth_Per`, `Mar Total LYS`, `Mar Total Tgt`, `Mar Total Act`, `Mar Ach Per`, `Mar Growth Per`, `Apr_Ins_LYS`, `Apr_Ins_Tgt`, `Apr_Ins_Act`, `Apr_Ins_Act_Per`, `Apr_Ins_Growth_Per`, `Apr_Reag_LYS`, `Apr_Reag_Tgt`, `Apr_Reag_Act`, `Apr_Reag_Act_Per`, `Apr_Reag_Growth_Per`, `Apr Total LYS`, `Apr Total Tgt`, `Apr Total Act`, `Apr Ach Per`, `Apr Growth Per`, `May_Ins_LYS`, `May_Ins_Tgt`, `May_Ins_Act`, `May_Ins_Act_Per`, `May_Ins_Growth_Per`, `May_Reag_LYS`, `May_Reag_Tgt`, `May_Reag_Act`, `May_Reag_Act_Per`, `May_Reag_Growth_Per`, `May Total LYS`, `May Total Tgt`, `May Total Act`, `May Ach Per`, `May Growth Per`, `Jun_Ins_LYS`, `Jun_Ins_Tgt`, `Jun_Ins_Act`, `Jun_Ins_Act_Per`, `Jun_Ins_Growth_Per`, `Jun_Reag_LYS`, `Jun_Reag_Tgt`, `Jun_Reag_Act`, `Jun_Reag_Act_Per`, `Jun_Reag_Growth_Per`, `Jun Total LYS`, `Jun Total Tgt`, `Jun Total Act`, `Jun Ach Per`, `Jun Growth Per`, `Jul_Ins_LYS`, `Jul_Ins_Tgt`, `Jul_Ins_Act`, `Jul_Ins_Act_Per`, `Jul_Ins_Growth_Per`, `Jul_Reag_LYS`, `Jul_Reag_Tgt`, `Jul_Reag_Act`, `Jul_Reag_Act_Per`, `Jul_Reag_Growth_Per`, `Jul Total LYS`, `Jul Total Tgt`, `Jul Total Act`, `Jul Ach Per`, `Jul Growth Per`, `Aug_Ins_LYS`, `Aug_Ins_Tgt`, `Aug_Ins_Act`, `Aug_Ins_Act_Per`, `Aug_Ins_Growth_Per`, `Aug_Reag_LYS`, `Aug_Reag_Tgt`, `Aug_Reag_Act`, `Aug_Reag_Act_Per`, `Aug_Reag_Growth_Per`, `Aug Total LYS`, `Aug Total Tgt`, `Aug Total Act`, `Aug Ach Per`, `Aug Growth Per`, `Sep_Ins_LYS`, `Sep_Ins_Tgt`, `Sep_Ins_Act`, `Sep_Ins_Act_Per`, `Sep_Ins_Growth_Per`, `Sep_Reag_LYS`, `Sep_Reag_Tgt`, `Sep_Reag_Act`, `Sep_Reag_Act_Per`, `Sep_Reag_Growth_Per`, `Sep Total LYS`, `Sep Total Tgt`, `Sep Total Act`, `Sep Ach Per`, `Sep Growth Per`, `Oct_Ins_LYS`, `Oct_Ins_Tgt`, `Oct_Ins_Act`, `Oct_Ins_Act_Per`, `Oct_Ins_Growth_Per`, `Oct_Reag_LYS`, `Oct_Reag_Tgt`, `Oct_Reag_Act`, `Oct_Reag_Act_Per`, `Oct_Reag_Growth_Per`, `Oct Total LYS`, `Oct Total Tgt`, `Oct Total Act`, `Oct Ach Per`, `Oct Growth Per`, `Nov_Ins_LYS`, `Nov_Ins_Tgt`, `Nov_Ins_Act`, `Nov_Ins_Act_Per`, `Nov_Ins_Growth_Per`, `Nov_Reag_LYS`, `Nov_Reag_Tgt`, `Nov_Reag_Act`, `Nov_Reag_Act_Per`, `Nov_Reag_Growth_Per`, `Nov Total LYS`, `Nov Total Tgt`, `Nov Total Act`, `Nov Ach Per`, `Nov Growth Per`, `Dec_Ins_LYS`, `Dec_Ins_Tgt`, `Dec_Ins_Act`, `Dec_Ins_Act_Per`, `Dec_Ins_Growth_Per`, `Dec_Reag_LYS`, `Dec_Reag_Tgt`, `Dec_Reag_Act`, `Dec_Reag_Act_Per`, `Dec_Reag_Growth_Per`, `Dec Total LYS`, `Dec Total Tgt`, `Dec Total Act`, `Dec Ach Per`, `Dec Growth Per` 
  FROM `am_wise_summary` 
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