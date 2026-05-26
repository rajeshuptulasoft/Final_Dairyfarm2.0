<?php
require_once __DIR__ . '/../middleware/jwt.php';

function listExpenses() {
    verifyJWT();
    $from = $_GET['from'] ?? '';
    $to = $_GET['to'] ?? '';
    $category = $_GET['category'] ?? '';
    $page = (int)($_GET['page'] ?? 1);
    $limit = 30; $offset = ($page - 1) * $limit;
    
    $where = "WHERE 1=1"; $params = [];
    if ($from) { $where .= " AND expense_date >= ?"; $params[] = $from; }
    if ($to) { $where .= " AND expense_date <= ?"; $params[] = $to; }
    if ($category) { $where .= " AND category = ?"; $params[] = $category; }
    
    $total = fetchOne("SELECT COUNT(*) as c FROM expenses $where", $params)['c'];
    $records = fetchAll("SELECT * FROM expenses $where ORDER BY expense_date DESC LIMIT $limit OFFSET $offset", $params);
    
    json(['records' => $records, 'total' => $total, 'page' => $page, 'pages' => ceil($total / $limit)]);
}

function createExpense($input) {
    verifyJWT();
    $errors = validate(['category', 'amount', 'expense_date'], $input);
    if ($errors) json(['errors' => $errors], 422);
    
    $id = insert(
        "INSERT INTO expenses (category, amount, expense_date, description, payment_method, recorded_by) VALUES (?,?,?,?,?,?)",
        [$input['category'], $input['amount'], $input['expense_date'], $input['description'] ?? null, $input['payment_method'] ?? null, $_SESSION['user_id'] ?? null]
    );
    json(['message' => 'Expense recorded', 'id' => $id], 201);
}

function expenseSummary() {
    verifyJWT();
    $month = $_GET['month'] ?? date('m');
    $year = $_GET['year'] ?? date('Y');
    
    $byCategory = fetchAll(
        "SELECT category, SUM(amount) as total FROM expenses 
         WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ? 
         GROUP BY category ORDER BY total DESC",
        [$month, $year]
    );
    $total = fetchOne(
        "SELECT SUM(amount) as total FROM expenses WHERE MONTH(expense_date) = ? AND YEAR(expense_date) = ?",
        [$month, $year]
    );
    $revenue = fetchOne(
        "SELECT SUM(amount) as total FROM revenue WHERE MONTH(revenue_date) = ? AND YEAR(revenue_date) = ?",
        [$month, $year]
    );
    
    json(['byCategory' => $byCategory, 'totalExpenses' => $total['total'] ?? 0, 'totalRevenue' => $revenue['total'] ?? 0, 'profit' => ($revenue['total'] ?? 0) - ($total['total'] ?? 0)]);
}
