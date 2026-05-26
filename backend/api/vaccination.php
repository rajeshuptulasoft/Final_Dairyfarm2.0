<?php
require_once __DIR__ . '/../middleware/jwt.php';

function listVaccinations() {
    verifyJWT();
    $animal_id = $_GET['animal_id'] ?? '';
    $where = "WHERE 1=1"; $params = [];
    if ($animal_id) { $where .= " AND v.animal_id = ?"; $params[] = $animal_id; }
    
    $records = fetchAll(
        "SELECT v.*, a.name as animal_name, a.tag_number 
         FROM vaccinations v JOIN animals a ON v.animal_id = a.id 
         $where ORDER BY v.vaccine_date DESC LIMIT 50", $params
    );
    json(['records' => $records]);
}

function createVaccination($input) {
    verifyJWT();
    $errors = validate(['animal_id', 'vaccine_name', 'vaccine_date'], $input);
    if ($errors) json(['errors' => $errors], 422);
    
    $id = insert(
        "INSERT INTO vaccinations (animal_id, vaccine_name, vaccine_date, next_due_date, doctor_name, batch_number, notes, cost, administered_by) VALUES (?,?,?,?,?,?,?,?,?)",
        [$input['animal_id'], $input['vaccine_name'], $input['vaccine_date'], $input['next_due_date'] ?? null, $input['doctor_name'] ?? null, $input['batch_number'] ?? null, $input['notes'] ?? null, $input['cost'] ?? null, $_SESSION['user_id'] ?? null]
    );
    
    if ($input['cost']) {
        execute("INSERT INTO expenses (category, amount, expense_date, description, recorded_by) VALUES ('vaccination',?,?,?,?)",
            [$input['cost'], $input['vaccine_date'], "Vaccination: {$input['vaccine_name']}", $_SESSION['user_id'] ?? null]);
    }
    
    json(['message' => 'Vaccination recorded', 'id' => $id], 201);
}

function upcomingVaccinations() {
    verifyJWT();
    $records = fetchAll(
        "SELECT v.*, a.name as animal_name, a.tag_number,
         DATEDIFF(v.next_due_date, CURDATE()) as days_until_due
         FROM vaccinations v JOIN animals a ON v.animal_id = a.id 
         WHERE v.next_due_date IS NOT NULL AND v.next_due_date >= CURDATE()
         ORDER BY v.next_due_date ASC LIMIT 20"
    );
    json(['records' => $records]);
}
