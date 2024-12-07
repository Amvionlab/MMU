<?php
include 'config.php';

$data = json_decode(file_get_contents('php://input'), true);

$encryptedEmail = $data['encryptedEmail'];
$encryptedPassword = $data['encryptedPassword'];
$key = $data['key'];

function xorDecrypt($data, $key) {
    $data = base64_decode($data);
    $decrypted = '';
    for ($i = 0; $i < strlen($data); $i++) {
        $decrypted .= chr(ord($data[$i]) ^ ord($key[$i % strlen($key)]));
    }
    return $decrypted;
}

$email = xorDecrypt($encryptedEmail, $key);
$password = xorDecrypt($encryptedPassword, $key);

// Sanitize inputs
$email = mysqli_real_escape_string($conn, $email);
$password = mysqli_real_escape_string($conn, $password);

// Query to fetch user with matching email
$sql = "SELECT * FROM user WHERE username = '$email'";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(['status' => 'error', 'message' => 'Database query failed: ' . mysqli_error($conn)]);
    exit;
}

if (mysqli_num_rows($result) > 0) {
    $user = mysqli_fetch_assoc($result);
    // Validate password
    if ($password == $user['password']) {
        $usertype = $user['usertype'];
        $branch = $user['branch'];

        $accessSql = "SELECT * FROM access WHERE id = '$usertype'";
        $accessResult = mysqli_query($conn, $accessSql);

        
        // Query to fetch access details with matching usertype
        $branchSql = "SELECT * FROM branch WHERE id = '$branch'";
        $branchResult = mysqli_query($conn, $branchSql);

        if (!$accessResult) {
            echo json_encode(['status' => 'error', 'message' => 'Database query failed: ' . mysqli_error($conn)]);
            exit;
        }

        if (mysqli_num_rows($accessResult) > 0) {
            $access = mysqli_fetch_assoc($accessResult);
            $branch = mysqli_fetch_assoc($branchResult);

            echo json_encode([
                'status' => 'success',
                'userid' => $user['id'],
                'accessid' => $user['usertype'],
                'email' => $user['email'],
                'mobile' => $user['mobile'],
                'firstname' => $user['firstname'],
                'lastname' => $user['lastname'],
                'branch' => $user['branch'],
                'location' => $branch['location_id'],
                'photo' => $user['photo'],
                'name' => $access['name'],
                'addapprove' => $access['addapprove'],
                'transfer' => $access['transfer'],
                'scrap' => $access['scrap'],
                'dashboard' => $access['dashboard'],
                'alc' => $access['alc'],
                'report' => $access['report'],
                'setup' => $access['setup'],
                'area' => $access['area_access'],
                'inventory' => $access['inventory'],
                'assetadd' => $access['assetadd'],
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'No access details found for the given usertype']);
        }

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email or password']);
}

mysqli_close($conn);
?>