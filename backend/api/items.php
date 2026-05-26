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
 * LIST ITEMS
 * Used for showing records in table
 */
function listItems() {

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

            item_name LIKE ?
            OR item_type LIKE ?
            OR is_fodder LIKE ?

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

         FROM items

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            id,

            item_name,

            is_fodder,

            item_type,

            item_life,

            item_life_unit,

            is_active,

            created_at

        FROM items

        $where

        ORDER BY created_at DESC

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
 * GET SINGLE ITEM
 */
function getItem($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT *

         FROM items

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Item not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE ITEM
 * INSERT DATA INTO DATABASE
 */
function createItem($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'item_name',
        'item_type'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    /**
     * CHECK DUPLICATE ITEM
     */
    $exists = fetchOne(

        "SELECT id
         FROM items
         WHERE item_name = ?",

        [$input['item_name']]
    );

    if ($exists) {

        json([
            'error' => 'Item already exists'
        ], 409);
    }

    /**
     * INSERT DATA
     */
    $id = insert(

        "INSERT INTO items (

            item_name,
            is_fodder,
            item_type,
            item_life,
            item_life_unit,
            is_active

        ) VALUES (

            ?,?,?,?,?,?

        )",

        [

            $input['item_name'],

            $input['is_fodder'] ?? 'Yes',

            $input['item_type'],

            nullable($input['item_life'] ?? null),

            nullable($input['item_life_unit'] ?? null),

            1

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT *

         FROM items

         WHERE id = ?",

        [$id]
    );

    json([

        'message' => 'Item created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE ITEM
 */
function updateItem($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM items
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Item not found'
        ], 404);
    }

    execute(

        "UPDATE items SET

            item_name = ?,
            is_fodder = ?,
            item_type = ?,
            item_life = ?,
            item_life_unit = ?,
            is_active = ?

         WHERE id = ?",

        [

            $input['item_name'],

            $input['is_fodder'] ?? 'Yes',

            $input['item_type'],

            nullable($input['item_life'] ?? null),

            nullable($input['item_life_unit'] ?? null),

            $input['is_active'] ?? 1,

            $id
        ]
    );

    json([
        'message' => 'Item updated successfully'
    ]);
}

/**
 * DELETE ITEM
 */
function deleteItem($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM items
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Item not found'
        ], 404);
    }

    execute(

        "DELETE FROM items
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Item deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'items.php') {
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
                    getItem($id);
                } else {
                    listItems();
                }
                break;
            case 'POST':
                createItem($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Item id is required'], 400);
                }
                updateItem($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Item id is required'], 400);
                }
                deleteItem($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}