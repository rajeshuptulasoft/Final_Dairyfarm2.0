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

function normalizeStockUnit($unit)
{
    $u = strtolower(trim((string)$unit));

    if ($u === '' || in_array($u, ['kg', 'kgs', 'kilogram', 'kilograms'], true)) {
        return 'kg';
    }

    if (in_array($u, ['l', 'ltr', 'litre', 'liter', 'litres', 'liters'], true)) {
        return 'litre';
    }

    return $u;
}

/**
 * Find an existing stock row for the same item (and unit) to merge refill quantity.
 */
function findExistingStockEntryForItem($itemId, $unit)
{
    $targetUnit = normalizeStockUnit($unit);

    $rows = fetchAll(

        "SELECT id, quantity, unit
         FROM stock_entries
         WHERE item_id = ?
           AND quantity > 0
           AND (supplier_type IS NULL
                OR supplier_type NOT IN ('Consumption', 'Consumption Reversal'))
           AND (remarks IS NULL OR remarks NOT LIKE 'Daily food%')
         ORDER BY id ASC",

        [$itemId]
    );

    foreach ($rows as $row) {

        if (normalizeStockUnit($row['unit'] ?? 'kg') === $targetUnit) {
            return $row;
        }
    }

    return null;
}

/**
 * LIST STOCK ENTRIES
 * Used for showing records in table
 */
function listStockEntries() {

    verifyJWT();

    $search = $_GET['search'] ?? '';

    $page = (int)($_GET['page'] ?? 1);

    $limit = (int)($_GET['limit'] ?? 20);

    $offset = ($page - 1) * $limit;

    $where = "WHERE se.quantity > 0
              AND (se.supplier_type IS NULL
                   OR se.supplier_type NOT IN ('Consumption', 'Consumption Reversal'))";

    $params = [];

    /**
     * SEARCH
     */
    if ($search) {

        $where .= " AND (

            i.item_name LIKE ?
            OR se.supplier LIKE ?
            OR se.batch_code LIKE ?
            OR se.bill_code LIKE ?

        )";

        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    /**
     * TOTAL RECORDS
     */
    $total = fetchOne(

        "SELECT COUNT(*) as c

         FROM stock_entries se

         JOIN items i
         ON i.id = se.item_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            se.id,

            se.item_id,

            se.entry_date,

            se.batch_code,

            se.supplier,

            se.donor,

            se.supplier_type,

            se.category,

            se.sub_category,

            se.bill_code,

            se.bill_date,

            se.quantity,

            se.unit,

            se.remarks,

            i.item_name,

            i.item_type

        FROM stock_entries se

        JOIN items i
        ON i.id = se.item_id

        $where

        ORDER BY se.entry_date DESC,
                 se.created_at DESC

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
 * GET SINGLE STOCK ENTRY
 */
function getStockEntry($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            se.*,

            i.item_name,

            i.item_type

        FROM stock_entries se

        JOIN items i
        ON i.id = se.item_id

        WHERE se.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Stock entry not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE STOCK ENTRY
 * INSERTS INTO DATABASE
 */
function createStockEntry($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'item_id',
        'entry_date',
        'quantity'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    /**
     * CHECK ITEM EXISTS
     */
    $item = fetchOne(

        "SELECT

            id,
            item_name,
            item_type

         FROM items

         WHERE id = ?",

        [$input['item_id']]
    );

    if (!$item) {

        json([
            'error' => 'Item not found'
        ], 404);
    }

    $addQty = (float)$input['quantity'];
    $unit = nullable($input['unit'] ?? 'Kg') ?? 'Kg';

    if ($addQty <= 0) {

        json([
            'error' => 'Quantity must be greater than zero'
        ], 422);
    }

    /**
     * Same item_id (+ unit) already in stock — add to existing quantity
     */
    $existing = findExistingStockEntryForItem($input['item_id'], $unit);

    if ($existing) {

        $previousQty = (float)$existing['quantity'];
        $newQty = round($previousQty + $addQty, 2);

        execute(

            "UPDATE stock_entries SET
                quantity = ?,
                entry_date = ?,
                batch_code = COALESCE(?, batch_code),
                supplier = COALESCE(?, supplier),
                donor = COALESCE(?, donor),
                supplier_type = COALESCE(?, supplier_type),
                category = COALESCE(?, category),
                sub_category = COALESCE(?, sub_category),
                bill_code = COALESCE(?, bill_code),
                bill_date = COALESCE(?, bill_date),
                remarks = COALESCE(?, remarks)
             WHERE id = ?",

            [
                $newQty,
                $input['entry_date'],
                nullable($input['batch_code'] ?? null),
                nullable($input['supplier'] ?? null),
                nullable($input['donor'] ?? null),
                nullable($input['supplier_type'] ?? null),
                nullable($input['category'] ?? null),
                nullable($input['sub_category'] ?? null),
                nullable($input['bill_code'] ?? null),
                nullable($input['bill_date'] ?? null),
                nullable($input['remarks'] ?? null),
                $existing['id'],
            ]
        );

        $id = (int)$existing['id'];
        $message = 'Stock updated — added ' . $addQty . ' ' . $unit
            . ' to existing entry (was ' . $previousQty . ', now ' . $newQty . ')';
        $merged = true;

    } else {

        /**
         * New item in stock — insert row
         */
        $id = insert(

            "INSERT INTO stock_entries (

                item_id,
                entry_date,
                batch_code,
                supplier,
                donor,
                supplier_type,
                category,
                sub_category,
                bill_code,
                bill_date,
                quantity,
                unit,
                remarks

            ) VALUES (

                ?,?,?,?,?,?,?,?,?,?,?,?,?

            )",

            [

                $input['item_id'],

                $input['entry_date'],

                nullable($input['batch_code'] ?? null),

                nullable($input['supplier'] ?? null),

                nullable($input['donor'] ?? null),

                nullable($input['supplier_type'] ?? null),

                nullable($input['category'] ?? null),

                nullable($input['sub_category'] ?? null),

                nullable($input['bill_code'] ?? null),

                nullable($input['bill_date'] ?? null),

                $addQty,

                $unit,

                nullable($input['remarks'] ?? null)

            ]
        );

        $message = 'Stock entry created successfully';
        $merged = false;
    }

    /**
     * FETCH RECORD
     */
    $record = fetchOne(

        "SELECT

            se.*,

            i.item_name,

            i.item_type

        FROM stock_entries se

        JOIN items i
        ON i.id = se.item_id

        WHERE se.id = ?",

        [$id]
    );

    json([

        'message' => $message,

        'merged' => $merged,

        'record' => $record

    ], $merged ? 200 : 201);
}

/**
 * UPDATE STOCK ENTRY
 */
function updateStockEntry($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM stock_entries
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Stock entry not found'
        ], 404);
    }

    execute(

        "UPDATE stock_entries SET

            item_id = ?,
            entry_date = ?,
            batch_code = ?,
            supplier = ?,
            donor = ?,
            supplier_type = ?,
            category = ?,
            sub_category = ?,
            bill_code = ?,
            bill_date = ?,
            quantity = ?,
            unit = ?,
            remarks = ?

         WHERE id = ?",

        [

            $input['item_id'],

            $input['entry_date'],

            nullable($input['batch_code'] ?? null),

            nullable($input['supplier'] ?? null),

            nullable($input['donor'] ?? null),

            nullable($input['supplier_type'] ?? null),

            nullable($input['category'] ?? null),

            nullable($input['sub_category'] ?? null),

            nullable($input['bill_code'] ?? null),

            nullable($input['bill_date'] ?? null),

            $input['quantity'],

            nullable($input['unit'] ?? 'Kg'),

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Stock entry updated successfully'
    ]);
}

/**
 * DELETE STOCK ENTRY
 */
function deleteStockEntry($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM stock_entries
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Stock entry not found'
        ], 404);
    }

    execute(

        "DELETE FROM stock_entries
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Stock entry deleted successfully'
    ]);
}

/**
 * LIST ITEMS (for stock entry dropdown)
 */
function listStockItems() {

    verifyJWT();

    $items = fetchAll(

        "SELECT id, item_name, item_type
         FROM items
         ORDER BY item_name"

    );

    json(['items' => $items]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'stock.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header('Content-Type: application/json');
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    try {
        switch ($method) {
            case 'GET':
                if (isset($_GET['items']) && $_GET['items'] == '1') {
                    listStockItems();
                } elseif ($id > 0) {
                    getStockEntry($id);
                } else {
                    listStockEntries();
                }
                break;
            case 'POST':
                createStockEntry($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateStockEntry($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteStockEntry($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}