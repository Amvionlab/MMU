<?php
include 'config.php'; // Include your database connection settings


$sqlLocations = "SELECT id, `name` FROM location";
$resultLocations = $conn->query($sqlLocations);

$zones = array();

if ($resultLocations->num_rows > 0) {
    while ($row = $resultLocations->fetch_assoc()) {
        $zones[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}



//Employee
$sqlEmpdetails = "SELECT `id`,`firstname` , `lastname`, `employee_id`, `department`, `designation`, `authority_id`, `branch`, `mobile`, `email`, `state`, `country`, `building`, `block`, `floor` FROM employee WHERE is_active = 1";
$resultEmpdetails = $conn->query($sqlEmpdetails);

$Empdetails = array();

if ($resultEmpdetails->num_rows > 0) {
    while ($row = $resultEmpdetails->fetch_assoc()) {
        $Empdetails[] = array(
            "id" => $row["id"],
            "firstname" => $row["firstname"],
            "lastname" => $row["lastname"],
            "employee_id" => $row["employee_id"],
            "department" => $row["department"],
            "designation" => $row["designation"],
            "authority_id" => $row["authority_id"],
            "branch" => $row["branch"],
            "mobile" => $row["mobile"],
            "email" => $row["email"],
            "state" => $row["state"],
            "country" => $row["country"],
            "building" => $row["building"],
            "block" => $row["block"],
            "floor" => $row["floor"]
        );
    }
}


$sqlAop = "SELECT id, `name` FROM aop"; // Modify query as per your table structure
$resultAop = $conn->query($sqlAop);

$aops = array();

if ($resultAop->num_rows > 0) {
    while ($row = $resultAop->fetch_assoc()) {
        $aops[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

// Product
$sqlProduct = "SELECT id, `name` FROM product"; // Modify query as per your table structure
$resultProduct = $conn->query($sqlProduct);

$products = array();

if ($resultProduct->num_rows > 0) {
    while ($row = $resultProduct->fetch_assoc()) {
        $products[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

// Division
$sqlDivision = "SELECT id, `name` FROM division"; // Modify query as per your table structure
$resultDivision = $conn->query($sqlDivision);

$divisions = array();

if ($resultDivision->num_rows > 0) {
    while ($row = $resultDivision->fetch_assoc()) {
        $divisions[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

// Territory
$sqlTerritory = "SELECT id, `name` FROM territory"; // Modify query as per your table structure
$resultTerritory = $conn->query($sqlTerritory);

$territories = array();

if ($resultTerritory->num_rows > 0) {
    while ($row = $resultTerritory->fetch_assoc()) {
        $territories[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

// State
$sqlState = "SELECT id, `name` FROM state"; // Modify query as per your table structure
$resultState = $conn->query($sqlState);

$states = array();

if ($resultState->num_rows > 0) {
    while ($row = $resultState->fetch_assoc()) {
        $states[] = array(
            "id" => $row["id"],
            "name" => $row["name"]
        );
    }
}

// Return the data as JSON, including all new sections
$response = array(
    "zones" => $zones,
    "Empdetails" => $Empdetails,
    "aops" => $aops,
    "products" => $products,
    "divisions" => $divisions,
    "territories" => $territories,
    "states" => $states
);

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
