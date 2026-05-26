<?php

require_once __DIR__ . '/../middleware/jwt.php';

/**
 * Convert empty string to NULL
 */
function nullable($value) {

    return ($value !== '' && $value !== null)
        ? $value
        : null;
}

/**
 * Resolve fodder item from item_id or item_name
 */
function resolveFodderItem($input) {

    if (!empty($input['item_id'])) {

        $item = fetchOne(

            "SELECT id, item_name, item_type
             FROM items
             WHERE id = ?",

            [$input['item_id']]
        );
    } elseif (!empty($input['item_name'])) {

        $item = fetchOne(

            "SELECT id, item_name, item_type
             FROM items
             WHERE LOWER(item_name) = LOWER(?)",

            [trim($input['item_name'])]
        );
    } else {
        return null;
    }

    if (!$item || strtolower(trim($item['item_type'])) !== 'fodder') {
        return null;
    }

    return $item;
}

/**
 * Table to track FIFO deductions (auto-created if missing)
 */
function ensureStockDeductionsTable() {

    static $ready = false;

    if ($ready) {
        return;
    }

    getDB()->query(

        "CREATE TABLE IF NOT EXISTS daily_food_stock_deductions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            daily_food_id INT UNSIGNED NOT NULL,
            stock_entry_id INT UNSIGNED NOT NULL,
            quantity DECIMAL(12, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            KEY idx_daily_food (daily_food_id),
            KEY idx_stock_entry (stock_entry_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $ready = true;
}

/**
 * Total remaining stock for an item (positive entries only)
 */
function getItemStockQuantity($itemId) {

    $row = fetchOne(

        "SELECT COALESCE(SUM(quantity), 0) AS total
         FROM stock_entries
         WHERE item_id = ?
           AND quantity > 0",

        [$itemId]
    );

    return (float)($row['total'] ?? 0);
}

/**
 * Deduct stock using FIFO — reduces existing stock entry quantities (no negative rows)
 */
function deductStockForDailyFood($itemId, $quantity, $unit, $foodDate, $dailyFoodId) {

    ensureStockDeductionsTable();

    $qty = (float)$quantity;

    if ($qty <= 0) {
        throw new Exception('Quantity must be greater than zero');
    }

    $available = getItemStockQuantity($itemId);

    if ($qty > $available + 0.0001) {
        throw new Exception(
            'Insufficient stock for this fodder item. Available: ' . round($available, 2)
        );
    }

    $entries = fetchAll(

        "SELECT id, quantity
         FROM stock_entries
         WHERE item_id = ?
           AND quantity > 0
         ORDER BY entry_date ASC, id ASC",

        [$itemId]
    );

    $remaining = $qty;

    foreach ($entries as $entry) {

        if ($remaining <= 0) {
            break;
        }

        $entryQty = (float)$entry['quantity'];
        $deduct = min($entryQty, $remaining);
        $newQty = round($entryQty - $deduct, 2);

        execute(

            "UPDATE stock_entries SET quantity = ? WHERE id = ?",

            [$newQty, $entry['id']]
        );

        insert(

            "INSERT INTO daily_food_stock_deductions (
                daily_food_id,
                stock_entry_id,
                quantity
            ) VALUES (?, ?, ?)",

            [$dailyFoodId, $entry['id'], $deduct]
        );

        $remaining -= $deduct;
    }

    if ($remaining > 0.0001) {
        throw new Exception(
            'Insufficient stock for this fodder item. Available: ' . round($available, 2)
        );
    }
}

/**
 * Restore stock when daily food is deleted or before update (adds quantity back to entries)
 */
function restoreStockForDailyFood($itemId, $quantity, $unit, $foodDate, $dailyFoodId) {

    ensureStockDeductionsTable();

    $logs = fetchAll(

        "SELECT stock_entry_id, quantity
         FROM daily_food_stock_deductions
         WHERE daily_food_id = ?",

        [$dailyFoodId]
    );

    if ($logs) {

        foreach ($logs as $log) {

            execute(

                "UPDATE stock_entries
                 SET quantity = quantity + ?
                 WHERE id = ?",

                [$log['quantity'], $log['stock_entry_id']]
            );
        }

        execute(

            "DELETE FROM daily_food_stock_deductions WHERE daily_food_id = ?",

            [$dailyFoodId]
        );

        return;
    }

    /**
     * Legacy rows from older negative-entry consumption
     */
    execute(

        "DELETE FROM stock_entries
         WHERE item_id = ?
           AND quantity < 0
           AND remarks = ?",

        [$itemId, 'Daily food #' . $dailyFoodId]
    );

    execute(

        "DELETE FROM stock_entries
         WHERE item_id = ?
           AND supplier_type = 'Consumption Reversal'
           AND remarks = ?",

        [$itemId, 'Reversal: daily food #' . $dailyFoodId]
    );
}

/**
 * Fodder items for daily food dropdown (item_type = Fodder)
 */
function listDailyFoodItems() {

    verifyJWT();

    $items = fetchAll(

        "SELECT
            i.id,
            i.item_name,
            i.item_type,
            COALESCE(SUM(CASE WHEN se.quantity > 0 THEN se.quantity ELSE 0 END), 0) AS stock_qty
         FROM items i
         LEFT JOIN stock_entries se
         ON se.item_id = i.id
         WHERE LOWER(TRIM(i.item_type)) = 'fodder'
         GROUP BY i.id, i.item_name, i.item_type
         ORDER BY i.item_name ASC"
    );

    json(['items' => $items]);
}

/**
 * LIST DAILY FOOD RECORDS
 * Used for showing records in table
 */
function listDailyFood() {

    verifyJWT();

    $search = $_GET['search'] ?? '';

    $page = (int)($_GET['page'] ?? 1);

    $limit = (int)($_GET['limit'] ?? 20);

    $offset = ($page - 1) * $limit;

    $where = "WHERE 1=1";

    $params = [];

    /**
     * SEARCH
     */
    if ($search) {

        $where .= " AND (

            a.name LIKE ?
            OR a.tag_number LIKE ?
            OR df.item_name LIKE ?

        )";

        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    /**
     * TOTAL RECORDS
     */
    $total = fetchOne(

        "SELECT COUNT(*) as c

         FROM daily_food df

         JOIN animals a
         ON a.id = df.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            df.id,

            df.food_date,

            df.item_name,

            df.quantity,

            df.unit,

            df.time_of_day,

            df.remarks,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        $where

        ORDER BY df.food_date DESC,
                 df.created_at DESC

        LIMIT $limit OFFSET $offset",

        $params
    );

    json([

        'records' => $records,

        'total' => (int)$total,

        'page' => $page,

        'pages' => ceil($total / $limit)

    ]);
}

/**
 * GET SINGLE FOOD RECORD
 */
function getDailyFood($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            df.*,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        WHERE df.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE DAILY FOOD RECORD
 */
function createDailyFood($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'food_date',
        'quantity'

    ];

    $errors = validate($fields, $input);

    if (empty($input['item_id']) && empty($input['item_name'])) {
        $errors[] = 'item_id or item_name is required';
    }

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    /**
     * CHECK ANIMAL EXISTS
     */
    $animal = fetchOne(

        "SELECT id
         FROM animals
         WHERE id = ?",

        [$input['animal_id']]
    );

    if (!$animal) {

        json([
            'error' => 'Animal not found'
        ], 404);
    }

    $item = resolveFodderItem($input);

    if (!$item) {

        json([
            'error' => 'Invalid fodder item. Select an item with type Fodder.'
        ], 422);
    }

    $itemName = $item['item_name'];
    $unit = $input['unit'] ?? 'Kg';
    $qty = (float)$input['quantity'];

    $db = getDB();
    $db->begin_transaction();

    try {

        $id = insert(

            "INSERT INTO daily_food (

                animal_id,
                food_date,
                item_name,
                quantity,
                unit,
                time_of_day,
                remarks

            ) VALUES (

                ?,?,?,?,?,?,?

            )",

            [

                $input['animal_id'],

                $input['food_date'],

                $itemName,

                $input['quantity'],

                $unit,

                $input['time_of_day'] ?? 'Morning',

                nullable($input['remarks'] ?? null)

            ]
        );

        if (!$id) {
            throw new Exception('Failed to create daily food record');
        }

        deductStockForDailyFood(
            (int)$item['id'],
            $qty,
            $unit,
            $input['food_date'],
            $id
        );

        $db->commit();

    } catch (Throwable $e) {

        $db->rollback();

        $msg = $e->getMessage();

        if (
            str_contains($msg, 'Insufficient stock')
            || str_contains($msg, 'Quantity must be greater')
        ) {
            json(['error' => $msg], 422);
        }

        throw $e;
    }

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            df.*,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        WHERE df.id = ?",

        [$id]
    );

    json([

        'message' => 'Daily food record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE DAILY FOOD RECORD
 */
function updateDailyFood($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id, item_name, quantity, unit, food_date
         FROM daily_food
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    $item = resolveFodderItem($input);

    if (!$item) {

        json([
            'error' => 'Invalid fodder item. Select an item with type Fodder.'
        ], 422);
    }

    $oldItem = fetchOne(

        "SELECT id FROM items WHERE LOWER(item_name) = LOWER(?)",

        [$record['item_name']]
    );

    $oldItemId = $oldItem ? (int)$oldItem['id'] : null;
    $newItemId = (int)$item['id'];
    $unit = $input['unit'] ?? 'Kg';
    $newQty = (float)$input['quantity'];
    $oldQty = (float)$record['quantity'];

    $db = getDB();
    $db->begin_transaction();

    try {

        if ($oldItemId) {
            restoreStockForDailyFood(
                $oldItemId,
                $oldQty,
                $record['unit'] ?? 'Kg',
                $record['food_date'],
                $id
            );
        }

        execute(

            "UPDATE daily_food SET

                animal_id = ?,
                food_date = ?,
                item_name = ?,
                quantity = ?,
                unit = ?,
                time_of_day = ?,
                remarks = ?

             WHERE id = ?",

            [

                $input['animal_id'],

                $input['food_date'],

                $item['item_name'],

                $input['quantity'],

                $unit,

                $input['time_of_day'] ?? 'Morning',

                nullable($input['remarks'] ?? null),

                $id
            ]
        );

        deductStockForDailyFood(
            $newItemId,
            $newQty,
            $unit,
            $input['food_date'],
            $id
        );

        $db->commit();

    } catch (Throwable $e) {

        $db->rollback();

        $msg = $e->getMessage();

        if (
            str_contains($msg, 'Insufficient stock')
            || str_contains($msg, 'Quantity must be greater')
        ) {
            json(['error' => $msg], 422);
        }

        throw $e;
    }

    json([
        'message' => 'Daily food record updated successfully'
    ]);
}

/**
 * DELETE DAILY FOOD RECORD
 */
function deleteDailyFood($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id, item_name, quantity, unit, food_date
         FROM daily_food
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    $item = fetchOne(

        "SELECT id FROM items WHERE LOWER(item_name) = LOWER(?)",

        [$record['item_name']]
    );

    $db = getDB();
    $db->begin_transaction();

    try {

        if ($item) {
            restoreStockForDailyFood(
                (int)$item['id'],
                (float)$record['quantity'],
                $record['unit'] ?? 'Kg',
                $record['food_date'],
                $id
            );
        }

        execute(

            "DELETE FROM daily_food WHERE id = ?",

            [$id]
        );

        $db->commit();

    } catch (Throwable $e) {

        $db->rollback();
        throw $e;
    }

    json([
        'message' => 'Daily food record deleted successfully'
    ]);
}

/**
 * API ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'dailyfood.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header('Content-Type: application/json');
    $method = $_SERVER['REQUEST_METHOD'];

    $input = json_decode(
        file_get_contents('php://input'),
        true
    ) ?? [];

    $id = isset($_GET['id'])
        ? (int) $_GET['id']
        : 0;

    try {
        switch ($method) {
            case 'GET':
                if (isset($_GET['items']) && $_GET['items'] == '1') {
                    listDailyFoodItems();
                } elseif ($id > 0) {
                    getDailyFood($id);
                } else {
                    listDailyFood();
                }
                break;

            case 'POST':
                createDailyFood($input);
                break;

            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateDailyFood($id, $input);
                break;

            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteDailyFood($id);
                break;

            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json([
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}