<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'dairy_farm_saas');
define('JWT_SECRET', 'dairy-farm-saas-jwt-secret-key-2026');
define('JWT_EXPIRY', 86400);

function getDB() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) die(json_encode(['error' => 'DB connection failed']));
        $conn->set_charset("utf8mb4");
    }
    return $conn;
}

function query($sql, $params = []) {
    $db = getDB();
    $stmt = $db->prepare($sql);
    if (!$stmt) {
        throw new Exception($db->error ?: 'Database prepare failed');
    }
    if ($params) {
        $types = str_repeat('s', count($params));
        $stmt->bind_param($types, ...$params);
    }
    if (!$stmt->execute()) {
        throw new Exception($stmt->error ?: 'Database execute failed');
    }
    return $stmt;
}

function fetchAll($sql, $params = []) {
    return query($sql, $params)->get_result()->fetch_all(MYSQLI_ASSOC);
}

function fetchOne($sql, $params = []) {
    return query($sql, $params)->get_result()->fetch_assoc();
}

function insert($sql, $params = []) {
    query($sql, $params);
    return getDB()->insert_id;
}

function execute($sql, $params = []) {
    return query($sql, $params);
}

function json($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function validate($fields, $data) {
    $errors = [];
    foreach ($fields as $f) {
        if (!isset($data[$f]) || trim($data[$f]) === '') {
            $errors[] = "$f is required";
        }
    }
    return $errors;
}
