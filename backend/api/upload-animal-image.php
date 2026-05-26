<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../middleware/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json(['error' => 'Invalid request method'], 405);
}

verifyJWT();

if (empty($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    json(['error' => 'No image uploaded or upload failed'], 400);
}

$file = $_FILES['image'];
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowed, true)) {
    json(['error' => 'Only JPEG, PNG, WEBP, or GIF images are allowed'], 400);
}

if ($file['size'] > 5 * 1024 * 1024) {
    json(['error' => 'Image must be 5MB or smaller'], 400);
}

$extMap = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
    'image/gif' => 'gif',
];
$ext = $extMap[$mime] ?? 'jpg';

$uploadDir = __DIR__ . '/../uploads/animals';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$filename = 'animal_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$target = $uploadDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    json(['error' => 'Failed to save image'], 500);
}

$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http')
    . '://' . $_SERVER['HTTP_HOST']
    . rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/\\');

$url = $baseUrl . '/uploads/animals/' . $filename;

json([
    'success' => true,
    'url' => $url,
    'image_url' => $url,
]);
