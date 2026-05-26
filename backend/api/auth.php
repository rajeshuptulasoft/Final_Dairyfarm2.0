<?php
require_once __DIR__ . '/../middleware/jwt.php';

function login($input) {
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if ($email === '' || $password === '') {
        json(['error' => 'Email and password are required'], 422);
    }

    $user = fetchOne(
        "SELECT * FROM users WHERE LOWER(TRIM(email)) = ? AND is_active = 1",
        [$email]
    );

    if (!$user) {
        json(['error' => 'Invalid credentials'], 401);
    }

    $validPassword = password_verify($password, $user['password']);
    // Support legacy plain-text passwords in local/dev databases
    if (!$validPassword && !str_starts_with((string) $user['password'], '$2')) {
        $validPassword = hash_equals((string) $user['password'], $password);
    }

    if (!$validPassword) {
        json(['error' => 'Invalid credentials'], 401);
    }

    execute("UPDATE users SET last_login = NOW() WHERE id = ?", [$user['id']]);
    $token = generateJWT($user);
    
    json([
        'token' => $token,
        'user' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'avatar' => $user['avatar']
        ]
    ]);
}

function me() {
    $user = verifyJWT();
    $u = fetchOne("SELECT id, name, email, role, phone, avatar, last_login, created_at FROM users WHERE id = ?", [$user['id']]);
    json(['user' => $u]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'auth.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header('Content-Type: application/json');
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    try {
        if ($method === 'POST') {
            login($input);
        } elseif ($method === 'GET') {
            me();
        } else {
            json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}
