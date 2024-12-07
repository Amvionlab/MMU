<?php
require 'config.php'; // Database configuration

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json'); // Set header for JSON response

$response = ['status' => 'error', 'message' => 'Invalid request'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $vendor_name = $_POST['vendor'] ?? '';
    $vendor_id = $_POST['vendorid'] ?? '';
    $gst = $_POST['gst'] ?? '';
    $location = $_POST['location'] ?? '';
    $contact_person = $_POST['contact'] ?? '';
    $mobile_no = $_POST['mobile'] ?? '';
    $email = $_POST['email'] ?? '';
    $address = $_POST['address'] ?? '';
    $state = $_POST['state'] ?? '';
    $country = $_POST['country'] ?? '';
    $is_active = '1';
    // Handle file upload
    $attachment_path = '';
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/'; // Set your upload directory
        $file_name = basename($_FILES['attachment']['name']);
        $target_file = $upload_dir . $file_name;

        // Move uploaded file to the target directory
        if (move_uploaded_file($_FILES['attachment']['tmp_name'], $target_file)) {
            $attachment_path = $target_file;
        } else {
            $response['message'] = 'File upload failed.';
            echo json_encode($response);
            exit;
        }
    }

    // Check if the vendor already exists
    $check_sql = "SELECT COUNT(*) AS count FROM vendor WHERE vendor_id = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param('s', $vendor_id);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    $row = $check_result->fetch_assoc();

    if ($row['count'] > 0) {
        $response['message'] = 'Vendor Already Exists';
    } else {
        // Insert data into the database
        $sql = "INSERT INTO vendor (vendor_name, vendor_id, gst, location, contact_person, mobile, email, address,state, country, attachment, is_active) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssssssssssss', $vendor_name, $vendor_id, $gst, $location, $contact_person, $mobile_no, $email, $address, $state, $country, $attachment_path, $is_active);
        
        if ($stmt->execute()) {
            $response['status'] = 'success';
            $response['message'] = 'Vendor added successfully.';
        } else {
            $response['message'] = 'Failed to add vendor details.';
        }

        $stmt->close();
    }

    $check_stmt->close();
    $conn->close();
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
