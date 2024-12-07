<?php
include 'config.php';

header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$action = isset($_GET['action']) ? $_GET['action'] : '';
$input = json_decode(file_get_contents("php://input"), true);
$locationId = isset($input['id']) ? $input['id'] : null;
$newName = isset($input['name']) ? trim($input['name']) : null;
$response = [];

if ($action == "getAllLocations") {
    // Fetch all locations from the database
    $sql = "SELECT id, name, is_active FROM division";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $locations = [];
        while ($row = $result->fetch_assoc()) {
            $locations[] = $row;
        }
        echo json_encode(['success' => true, 'locations' => $locations]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No locations found.']);
    }
} elseif ($action == "toggleStatus" && !empty($locationId)) {
    // Fetch current `is_active` status
    $getStatusSql = "SELECT is_active FROM division WHERE id = ?";
    $stmt = $conn->prepare($getStatusSql);
    $stmt->bind_param("i", $locationId);
    $stmt->execute();
    $stmt->bind_result($isActive);
    $stmt->fetch();
    $stmt->close();

    // Toggle the status
    $newStatus = $isActive ? 0 : 1;

    // Update the status in the database
    $updateStatusSql = "UPDATE division SET is_active = ? WHERE id = ?";
    $stmt = $conn->prepare($updateStatusSql);
    $stmt->bind_param("ii", $newStatus, $locationId);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'newStatus' => $newStatus,
            'message' => 'Status updated successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update status: ' . $stmt->error
        ]);
    }

    $stmt->close();
} elseif ($action == "add") {
    $checkSql = "SELECT id FROM division WHERE name = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $newName);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Location name already exists.']);
    } else {
        // Insert the new location
        $insertSql = "INSERT INTO division (name, is_active) VALUES (?, ?)";
        $isActive = 1;
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("si", $newName, $isActive);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Location added successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add location: ' . $stmt->error]);
        }
    }
    
} elseif ($action == "update" && !empty($locationId)) {
    // Check if location name already exists for another record
    $checkSql = "SELECT id FROM division WHERE name = ? AND id != ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("si", $newName, $locationId);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Location name already exists.']);
    } else {
        // Update the existing location
        $updateSql = "UPDATE division SET name = ? WHERE id = ?";
        $stmt = $conn->prepare($updateSql);
        $stmt->bind_param("si", $newName, $locationId);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Location updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update location: ' . $stmt->error]);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid action specified.']);
}

$conn->close();
?>
