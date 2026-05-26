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
if (empty($data['product_name']) || empty($data['customer_name']) || empty($data['mobile_number']) || empty($data['address'])) {
    json(['success' => false, 'message' => 'All fields are required'], 400);
}

// Validate mobile number format
if (!preg_match('/^[0-9\s\-\+]{10,}$/', str_replace([' ', '-', '+'], '', $data['mobile_number']))) {
    json(['success' => false, 'message' => 'Invalid mobile number'], 400);
}

// Sanitize inputs
$product_name = htmlspecialchars(trim($data['product_name']));
$customer_name = htmlspecialchars(trim($data['customer_name']));
$mobile_number = htmlspecialchars(trim($data['mobile_number']));
$address = htmlspecialchars(trim($data['address']));
$message = htmlspecialchars(trim($data['message'] ?? ''));

// Insert into database
$sql = "INSERT INTO product_enquiries (product_name, customer_name, mobile_number, address, message, created_at) 
        VALUES (?, ?, ?, ?, ?, NOW())";

try {
    $stmt = getDB()->prepare($sql);
    if (!$stmt) {
        throw new Exception('Prepare failed: ' . getDB()->error);
    }

    $stmt->bind_param('sssss', $product_name, $customer_name, $mobile_number, $address, $message);
    
    if (!$stmt->execute()) {
        throw new Exception('Execute failed: ' . $stmt->error);
    }

    json([
        'success' => true,
        'message' => 'Enquiry submitted successfully. We will contact you soon.',
        'id' => getDB()->insert_id
    ]);
} catch (Exception $e) {
    json(['success' => false, 'message' => $e->getMessage()], 500);
}
?>
