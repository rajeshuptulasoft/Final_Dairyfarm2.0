<?php
require_once __DIR__ . '/../middleware/jwt.php';

function listFeed() {
    verifyJWT();
    $animal_id = $_GET['animal_id'] ?? '';
    $from = $_GET['from'] ?? '';
    $to = $_GET['to'] ?? '';
    
    $where = "WHERE 1=1"; $params = [];
    if ($animal_id) { $where .= " AND fc.animal_id = ?"; $params[] = $animal_id; }
    if ($from) { $where .= " AND fc.feed_date >= ?"; $params[] = $from; }
    if ($to) { $where .= " AND fc.feed_date <= ?"; $params[] = $to; }
    
    $records = fetchAll(
        "SELECT fc.*, a.name as animal_name, fi.feed_name 
         FROM feed_consumption fc 
         JOIN animals a ON fc.animal_id = a.id 
         JOIN feed_inventory fi ON fc.feed_id = fi.id 
         $where ORDER BY fc.feed_date DESC LIMIT 50", $params
    );
    json(['records' => $records]);
}

function createFeed($input) {
    verifyJWT();
    $errors = validate(['animal_id', 'feed_id', 'quantity_kg', 'feed_date'], $input);
    if ($errors) json(['errors' => $errors], 422);
    
    $id = insert(
        "INSERT INTO feed_consumption (animal_id, feed_id, quantity_kg, feed_date, session, notes, recorded_by) VALUES (?,?,?,?,?,?,?)",
        [$input['animal_id'], $input['feed_id'], $input['quantity_kg'], $input['feed_date'], $input['session'] ?? 'morning', $input['notes'] ?? null, $_SESSION['user_id'] ?? null]
    );
    execute("UPDATE feed_inventory SET stock_kg = stock_kg - ? WHERE id = ?", [$input['quantity_kg'], $input['feed_id']]);
    json(['message' => 'Feed recorded', 'id' => $id], 201);
}

function feedInventory() {
    verifyJWT();
    $items = fetchAll("SELECT * FROM feed_inventory WHERE is_active = 1 ORDER BY feed_name");
    json(['items' => $items]);
}

function addFeedStock($input) {
    verifyJWT(['admin', 'manager']);
    $errors = validate(['feed_name', 'stock_kg', 'unit_price'], $input);
    if ($errors) json(['errors' => $errors], 422);
    
    $id = insert(
        "INSERT INTO feed_inventory (feed_name, category, stock_kg, unit_price, supplier, min_stock_alert) VALUES (?,?,?,?,?,?)",
        [$input['feed_name'], $input['category'] ?? 'general', $input['stock_kg'], $input['unit_price'], $input['supplier'] ?? null, $input['min_stock_alert'] ?? 50]
    );
    json(['message' => 'Feed stock added', 'id' => $id], 201);
}
