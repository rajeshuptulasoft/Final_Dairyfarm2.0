<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(['error' => 'Invalid request method'], 400);
}

$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($data['name']) || empty($data['email']) || empty($data['mobile']) || empty($data['address']) || empty($data['message'])) {
    json(['success' => false, 'message' => 'All fields are required'], 400);
}

// Validate email format
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    json(['success' => false, 'message' => 'Invalid email address'], 400);
}

// Validate mobile number format
if (!preg_match('/^[0-9\s\-\+]{10,}$/', str_replace([' ', '-', '+'], '', $data['mobile']))) {
    json(['success' => false, 'message' => 'Invalid mobile number'], 400);
}

// Sanitize inputs
$name = htmlspecialchars(trim($data['name']));
$email = htmlspecialchars(trim($data['email']));
$mobile_number = htmlspecialchars(trim($data['mobile']));
$address = htmlspecialchars(trim($data['address']));
$message = htmlspecialchars(trim($data['message']));

// Insert into database
$sql = "INSERT INTO contact_messages (name, email, mobile_number, address, message, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())";

try {
    $stmt = getDB()->prepare($sql);
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . getDB()->error);
    }

    $stmt->bind_param('sssss', $name, $email, $mobile_number, $address, $message);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    json([
        'success' => true,
        'message' => 'Message sent successfully. We will get back to you soon.',
        'id' => getDB()->insert_id
    ]);
} catch (Exception $e) {
    json(['success' => false, 'message' => $e->getMessage()], 500);
}
?>
