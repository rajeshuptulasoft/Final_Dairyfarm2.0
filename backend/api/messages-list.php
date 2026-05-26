<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once '../config/database.php';

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'list':
        handleList();
        break;
    case 'get':
        handleGet();
        break;
    case 'delete':
        handleDelete();
        break;
    case 'mark_read':
        handleMarkRead();
        break;
    default:
        json(['error' => 'Invalid action'], 400);
}

function handleList() {
    $sql = "SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100";
    try {
        $result = fetchAll($sql);
        json(['success' => true, 'data' => $result]);
    } catch (Exception $e) {
        json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

function handleGet() {
    if (empty($_GET['id'])) {
        json(['error' => 'ID is required'], 400);
    }
    
    $sql = "SELECT * FROM contact_messages WHERE id = ?";
    try {
        $result = fetchOne($sql, [$_GET['id']]);
        json(['success' => true, 'data' => $result]);
    } catch (Exception $e) {
        json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

function handleDelete() {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        json(['error' => 'Invalid method'], 405);
    }
    
    if (empty($_GET['id'])) {
        json(['error' => 'ID is required'], 400);
    }

    $sql = "DELETE FROM contact_messages WHERE id = ?";
    try {
        execute($sql, [$_GET['id']]);
        json(['success' => true, 'message' => 'Message deleted']);
    } catch (Exception $e) {
        json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

function handleMarkRead() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        json(['error' => 'Invalid method'], 405);
    }

    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        json(['error' => 'ID is required'], 400);
    }

    $sql = "UPDATE contact_messages SET is_read = 1 WHERE id = ?";
    try {
        execute($sql, [$data['id']]);
        json(['success' => true, 'message' => 'Marked as read']);
    } catch (Exception $e) {
        json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}
?>
