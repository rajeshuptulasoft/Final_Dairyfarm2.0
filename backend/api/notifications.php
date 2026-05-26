<?php
require_once __DIR__ . '/../middleware/jwt.php';

function listNotifications() {
    $user = verifyJWT();
    $unread = fetchAll("SELECT * FROM notifications WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0 ORDER BY created_at DESC LIMIT 20", [$user['id']]);
    $all = fetchAll("SELECT * FROM notifications WHERE (user_id = ? OR user_id IS NULL) ORDER BY created_at DESC LIMIT 50", [$user['id']]);
    json(['unread' => $unread, 'all' => $all, 'unreadCount' => count($unread)]);
}

function markRead($input) {
    $user = verifyJWT();
    $id = $input['id'] ?? null;
    if ($id) {
        execute("UPDATE notifications SET is_read = 1 WHERE id = ? AND (user_id = ? OR user_id IS NULL)", [$id, $user['id']]);
    } else {
        execute("UPDATE notifications SET is_read = 1 WHERE (user_id = ? OR user_id IS NULL) AND is_read = 0", [$user['id']]);
    }
    json(['message' => 'Notifications marked as read']);
}

// Helper called from other modules
function createNotification($userId, $title, $message, $type = 'info', $module = null, $relatedId = null) {
    execute(
        "INSERT INTO notifications (user_id, title, message, type, related_module, related_id) VALUES (?,?,?,?,?,?)",
        [$userId, $title, $message, $type, $module, $relatedId]
    );
}
