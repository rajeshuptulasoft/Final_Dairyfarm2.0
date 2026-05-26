<?php
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once __DIR__ . '/config/database.php';

$route = trim($_GET['route'] ?? '', '/');
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

try {
    switch (true) {
        case $route === 'auth/login' && $method === 'POST':
            require __DIR__ . '/api/auth.php';
            login($input);
            break;
        case $route === 'auth/me' && $method === 'GET':
            require __DIR__ . '/api/auth.php';
            me();
            break;
        case $route === 'dashboard' && $method === 'GET':
            require __DIR__ . '/api/dashboard.php';
            getDashboard();
            break;
        case preg_match('#^animals/(\d+)$#', $route, $m) && $method === 'GET':
            require __DIR__ . '/api/animals.php';
            getAnimal((int)$m[1]);
            break;
        case preg_match('#^animals/(\d+)$#', $route, $m) && $method === 'PUT':
            require __DIR__ . '/api/animals.php';
            updateAnimal((int)$m[1], $input);
            break;
        case preg_match('#^animals/(\d+)$#', $route, $m) && $method === 'DELETE':
            require __DIR__ . '/api/animals.php';
            deleteAnimal((int)$m[1]);
            break;
        case $route === 'animals' && $method === 'GET':
            require __DIR__ . '/api/animals.php';
            listAnimals();
            break;
        case $route === 'animals' && $method === 'POST':
            require __DIR__ . '/api/animals.php';
            createAnimal($input);
            break;
        case $route === 'milk' && $method === 'GET':
            require __DIR__ . '/api/milk.php';
            listMilk();
            break;
        case $route === 'milk' && $method === 'POST':
            require __DIR__ . '/api/milk.php';
            createMilk($input);
            break;
        case preg_match('/^milk\/(\d+)$/', $route, $m) && $method === 'PUT':
            require __DIR__ . '/api/milk.php';
            updateMilk((int)$m[1], $input);
            break;
        case preg_match('/^milk\/(\d+)$/', $route, $m) && $method === 'DELETE':
            require __DIR__ . '/api/milk.php';
            deleteMilk((int)$m[1]);
            break;
        case $route === 'milk/stats' && $method === 'GET':
            require __DIR__ . '/api/milk.php';
            milkStats();
            break;
        case $route === 'heat' && $method === 'GET':
            require __DIR__ . '/api/heat.php';
            listHeat();
            break;
        case $route === 'heat' && $method === 'POST':
            require __DIR__ . '/api/heat.php';
            createHeat($input);
            break;
        case $route === 'catalogue' && $method === 'GET':
            require __DIR__ . '/api/catalogue.php';
            listCatalogue();
            break;
        case $route === 'catalogue' && $method === 'POST':
            require __DIR__ . '/api/catalogue.php';
            createCatalogue($input);
            break;
        case $route === 'feed' && $method === 'GET':
            require __DIR__ . '/api/feed.php';
            listFeed();
            break;
        case $route === 'feed' && $method === 'POST':
            require __DIR__ . '/api/feed.php';
            createFeed($input);
            break;
        case $route === 'feed/inventory' && $method === 'GET':
            require __DIR__ . '/api/feed.php';
            feedInventory();
            break;
        case $route === 'feed/inventory' && $method === 'POST':
            require __DIR__ . '/api/feed.php';
            addFeedStock($input);
            break;
        case $route === 'vaccinations' && $method === 'GET':
            require __DIR__ . '/api/vaccination.php';
            listVaccinations();
            break;
        case $route === 'vaccinations' && $method === 'POST':
            require __DIR__ . '/api/vaccination.php';
            createVaccination($input);
            break;
        case $route === 'vaccinations/upcoming' && $method === 'GET':
            require __DIR__ . '/api/vaccination.php';
            upcomingVaccinations();
            break;
        case $route === 'breeding' && $method === 'GET':
            require __DIR__ . '/api/breeding.php';
            listBreeding();
            break;
        case $route === 'breeding' && $method === 'POST':
            require __DIR__ . '/api/breeding.php';
            createBreeding($input);
            break;
        case $route === 'pregnancy' && $method === 'GET':
            require __DIR__ . '/api/breeding.php';
            listPregnancy();
            break;
        case $route === 'pregnancy' && $method === 'POST':
            require __DIR__ . '/api/breeding.php';
            createPregnancy($input);
            break;
        case $route === 'health' && $method === 'GET':
            require __DIR__ . '/api/health.php';
            listHealth();
            break;
        case $route === 'health' && $method === 'POST':
            require __DIR__ . '/api/health.php';
            createHealth($input);
            break;
        case $route === 'expenses' && $method === 'GET':
            require __DIR__ . '/api/expenses.php';
            listExpenses();
            break;
        case $route === 'expenses' && $method === 'POST':
            require __DIR__ . '/api/expenses.php';
            createExpense($input);
            break;
        case $route === 'expenses/summary' && $method === 'GET':
            require __DIR__ . '/api/expenses.php';
            expenseSummary();
            break;
        case $route === 'reports/milk' && $method === 'GET':
            require __DIR__ . '/api/reports.php';
            milkReport();
            break;
        case $route === 'reports/expenses' && $method === 'GET':
            require __DIR__ . '/api/reports.php';
            expenseReport();
            break;
        case $route === 'employees' && $method === 'GET':
            require __DIR__ . '/api/employees.php';
            listEmployees();
            break;
        case $route === 'employees' && $method === 'POST':
            require __DIR__ . '/api/employees.php';
            createEmployee($input);
            break;
        case $route === 'notifications' && $method === 'GET':
            require __DIR__ . '/api/notifications.php';
            listNotifications();
            break;
        case $route === 'notifications/read' && $method === 'POST':
            require __DIR__ . '/api/notifications.php';
            markRead($input);
            break;
        default:
            json(['error' => 'Route not found', 'route' => $route], 404);
    }
} catch (Exception $e) {
    json(['error' => $e->getMessage()], 500);
}
