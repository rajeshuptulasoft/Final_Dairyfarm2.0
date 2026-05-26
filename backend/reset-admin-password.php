<?php
/**
 * One-time helper: open in browser to reset admin password.
 * http://localhost/Dariy_farm2.0/backend/reset-admin-password.php
 * Then sign in with admin@dairyfarm.com / password
 */
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json');

$email = 'admin@dairyfarm.com';
$newPassword = 'password';
$hash = password_hash($newPassword, PASSWORD_DEFAULT);

$user = fetchOne('SELECT id FROM users WHERE LOWER(email) = ?', [strtolower($email)]);

if ($user) {
    execute('UPDATE users SET password = ?, is_active = 1 WHERE id = ?', [$hash, $user['id']]);
    json([
        'success' => true,
        'message' => 'Admin password reset successfully.',
        'email' => $email,
        'password' => $newPassword,
    ]);
}

execute(
    'INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)',
    ['Admin', $email, $hash, 'admin']
);

json([
    'success' => true,
    'message' => 'Admin user created successfully.',
    'email' => $email,
    'password' => $newPassword,
]);
