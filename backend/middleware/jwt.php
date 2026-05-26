<?php
require_once __DIR__ . '/../config/database.php';

function generateJWT($user) {
    $header = base64url_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64url_encode(json_encode([
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'iat' => time(),
        'exp' => time() + JWT_EXPIRY
    ]));
    $signature = base64url_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function verifyJWT() {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!$auth && function_exists('getallheaders')) {
        $headers = getallheaders();
        $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (!preg_match('/Bearer\s(\S+)/', $auth, $m)) {
        json(['error' => 'Unauthorized'], 401);
    }
    $parts = explode('.', $m[1]);
    if (count($parts) !== 3) json(['error' => 'Invalid token'], 401);
    
    $payload = json_decode(base64url_decode($parts[1]), true);
    if (!$payload || $payload['exp'] < time()) {
        json(['error' => 'Token expired'], 401);
    }
    
    $signature = base64url_encode(hash_hmac('sha256', "$parts[0].$parts[1]", JWT_SECRET, true));
    if (!hash_equals($signature, $parts[2])) {
        json(['error' => 'Invalid signature'], 401);
    }
    
    return $payload;
}

function requireRole($roles) {
    $user = verifyJWT();
    if (!in_array($user['role'], (array)$roles)) {
        json(['error' => 'Forbidden'], 403);
    }
    return $user;
}

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
}
