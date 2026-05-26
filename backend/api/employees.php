<?php
require_once __DIR__ . '/../middleware/jwt.php';

function listEmployees() {
    requireRole(['admin', 'manager']);
    $users = fetchAll("SELECT id, name, email, role, phone, avatar, is_active, last_login, created_at FROM users ORDER BY created_at DESC");
    json(['employees' => $users]);
}

function createEmployee($input) {
    requireRole(['admin']);
    $errors = validate(['name', 'email', 'password', 'role'], $input);
    if ($errors) json(['errors' => $errors], 422);
    
    $exists = fetchOne("SELECT id FROM users WHERE email = ?", [$input['email']]);
    if ($exists) json(['error' => 'Email already exists'], 409);
    
    $hash = password_hash($input['password'], PASSWORD_DEFAULT);
    $id = insert(
        "INSERT INTO users (name, email, password, role, phone) VALUES (?,?,?,?,?)",
        [$input['name'], $input['email'], $hash, $input['role'], $input['phone'] ?? null]
    );
    json(['message' => 'Employee created', 'id' => $id], 201);
}
