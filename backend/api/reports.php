<?php
require_once __DIR__ . '/../middleware/jwt.php';

function milkReport() {
    verifyJWT();
    $from = $_GET['from'] ?? date('Y-m-01');
    $to = $_GET['to'] ?? date('Y-m-d');
    
    $records = fetchAll(
        "SELECT mr.milk_date, a.name, a.tag_number, a.breed,
         SUM(mr.quantity_ltr) as total,
         SUM(CASE WHEN mr.session='morning' THEN mr.quantity_ltr ELSE 0 END) as morning,
         SUM(CASE WHEN mr.session='evening' THEN mr.quantity_ltr ELSE 0 END) as evening
         FROM milk_records mr JOIN animals a ON mr.animal_id = a.id
         WHERE mr.milk_date BETWEEN ? AND ?
         GROUP BY mr.milk_date, a.id
         ORDER BY mr.milk_date ASC",
        [$from, $to]
    );
    
    $summary = fetchOne(
        "SELECT COUNT(DISTINCT milk_date) as days, COUNT(DISTINCT animal_id) as animals, SUM(quantity_ltr) as total, AVG(quantity_ltr) as daily_avg
         FROM milk_records WHERE milk_date BETWEEN ? AND ?",
        [$from, $to]
    );
    
    json(['records' => $records, 'summary' => $summary]);
}

function expenseReport() {
    verifyJWT();
    $from = $_GET['from'] ?? date('Y-01-01');
    $to = $_GET['to'] ?? date('Y-m-d');
    
    $records = fetchAll(
        "SELECT DATE_FORMAT(expense_date, '%Y-%m') as month, category, SUM(amount) as total
         FROM expenses WHERE expense_date BETWEEN ? AND ?
         GROUP BY month, category ORDER BY month ASC",
        [$from, $to]
    );
    
    $summary = fetchOne(
        "SELECT SUM(amount) as total, COUNT(*) as entries, AVG(amount) as avg_expense
         FROM expenses WHERE expense_date BETWEEN ? AND ?",
        [$from, $to]
    );
    
    json(['records' => $records, 'summary' => $summary]);
}
