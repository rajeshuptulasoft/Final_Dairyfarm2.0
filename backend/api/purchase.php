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
 * LIST PURCHASE RECORDS
 * Used for showing records in table
 */
function listPurchaseRecords() {

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
            OR pr.bill_code LIKE ?
            OR pr.unit LIKE ?

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

         FROM purchase_records pr

         JOIN items i
         ON i.id = pr.item_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            pr.id,

            pr.item_id,

            pr.purchase_date,

            pr.bill_code,

            pr.quantity,

            pr.rate,

            pr.total_amount,

            pr.unit,

            pr.paid,

            pr.remarks,

            i.item_name,

            i.item_type

        FROM purchase_records pr

        JOIN items i
        ON i.id = pr.item_id

        $where

        ORDER BY pr.purchase_date DESC,
                 pr.created_at DESC

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
 * GET SINGLE PURCHASE RECORD
 */
function getPurchaseRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            pr.*,

            i.item_name,

            i.item_type

        FROM purchase_records pr

        JOIN items i
        ON i.id = pr.item_id

        WHERE pr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Purchase record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE PURCHASE RECORD
 * INSERT DATA INTO DATABASE
 */
function createPurchaseRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'item_id',
        'purchase_date',
        'quantity',
        'rate'

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
     * CALCULATE TOTAL
     */
    $quantity = (float)$input['quantity'];

    $rate = (float)$input['rate'];

    $total_amount = $quantity * $rate;

    /**
     * INSERT DATA
     */
    $id = insert(

        "INSERT INTO purchase_records (

            item_id,
            purchase_date,
            bill_code,
            quantity,
            rate,
            total_amount,
            unit,
            paid,
            remarks

        ) VALUES (

            ?,?,?,?,?,?,?,?,?

        )",

        [

            $input['item_id'],

            $input['purchase_date'],

            nullable($input['bill_code'] ?? null),

            $quantity,

            $rate,

            $total_amount,

            $input['unit'] ?? 'Kg',

            $input['paid'] ?? 'No',

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            pr.*,

            i.item_name,

            i.item_type

        FROM purchase_records pr

        JOIN items i
        ON i.id = pr.item_id

        WHERE pr.id = ?",

        [$id]
    );

    json([

        'message' => 'Purchase record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE PURCHASE RECORD
 */
function updatePurchaseRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM purchase_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Purchase record not found'
        ], 404);
    }

    /**
     * CALCULATE TOTAL
     */
    $quantity = (float)$input['quantity'];

    $rate = (float)$input['rate'];

    $total_amount = $quantity * $rate;

    execute(

        "UPDATE purchase_records SET

            item_id = ?,
            purchase_date = ?,
            bill_code = ?,
            quantity = ?,
            rate = ?,
            total_amount = ?,
            unit = ?,
            paid = ?,
            remarks = ?

         WHERE id = ?",

        [

            $input['item_id'],

            $input['purchase_date'],

            nullable($input['bill_code'] ?? null),

            $quantity,

            $rate,

            $total_amount,

            $input['unit'] ?? 'Kg',

            $input['paid'] ?? 'No',

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Purchase record updated successfully'
    ]);
}

/**
 * DELETE PURCHASE RECORD
 */
function deletePurchaseRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM purchase_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Purchase record not found'
        ], 404);
    }

    execute(

        "DELETE FROM purchase_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Purchase record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'purchase.php') {
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
                if ($id > 0) {
                    getPurchaseRecord($id);
                } else {
                    listPurchaseRecords();
                }
                break;
            case 'POST':
                createPurchaseRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updatePurchaseRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deletePurchaseRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}