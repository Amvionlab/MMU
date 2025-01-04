<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

header("Content-Type: application/json");

// Load environment variables
function loadEnv($filePath)
{
    if (!file_exists($filePath)) {
        throw new Exception("File not found: $filePath");
    }

    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        putenv("$name=$value");
    }
}

// Load the .env file
loadEnv(__DIR__ . '/.env');

// Get database credentials
$dbHost = getenv('DB2_HOST'); // IP address or hostname of the SQL Server
$dbUsername = getenv('DB2_USERNAME');
$dbPassword = getenv('DB2_PASSWORD');
$dbName = getenv('DB2_DATABASE');

// Connection string
$connectionInfo = [
    "Database" => $dbName,
    "UID" => $dbUsername,
    "PWD" => $dbPassword,
    "CharacterSet" => "UTF-8",
    "TrustServerCertificate" => true // Needed for ODBC Driver 18+
];

$conn = sqlsrv_connect($dbHost, $connectionInfo);

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        "error" => "Connection to database failed",
        "details" => sqlsrv_errors()
    ]);
    exit;
}

// Use $conn for queries
?>
