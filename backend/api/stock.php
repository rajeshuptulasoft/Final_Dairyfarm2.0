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
 * LIST STOCK ENTRIES
 * Used for showing records in table
 */
function listStockEntries() {

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

    /**
     * INSERT DATA
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

            $input['quantity'],

            nullable($input['unit'] ?? 'Kg'),

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
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

        'message' => 'Stock entry created successfully',

        'record' => $record

    ], 201);
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