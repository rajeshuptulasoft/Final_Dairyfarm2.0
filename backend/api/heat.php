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
 * LIST HEAT RECORDS
 * Used for showing records in table
 */
function listHeatRecords() {

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

            a.tag_number LIKE ?
            OR a.name LIKE ?
            OR a.breed LIKE ?

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

         FROM heat_records hr

         JOIN animals a
         ON a.id = hr.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            hr.id,

            hr.animal_id,

            hr.heat_date,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM heat_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        $where

        ORDER BY hr.heat_date DESC,
                 hr.created_at DESC

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
 * GET SINGLE HEAT RECORD
 */
function getHeatRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            hr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM heat_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        WHERE hr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Heat record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE HEAT RECORD
 * INSERTS INTO DATABASE
 */
function createHeatRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'heat_date'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    /**
     * CHECK ANIMAL EXISTS
     */
    $animal = fetchOne(

        "SELECT

            id,
            tag_number,
            name,
            breed

         FROM animals

         WHERE id = ?",

        [$input['animal_id']]
    );

    if (!$animal) {

        json([
            'error' => 'Animal not found'
        ], 404);
    }

    /**
     * INSERT DATA INTO DATABASE
     */
    $id = insert(

        "INSERT INTO heat_records (

            animal_id,
            heat_date

        ) VALUES (

            ?,?

        )",

        [

            $input['animal_id'],

            $input['heat_date']

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            hr.id,
            hr.heat_date,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM heat_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        WHERE hr.id = ?",

        [$id]
    );

    json([

        'message' => 'Heat record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE HEAT RECORD
 */
function updateHeatRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM heat_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Heat record not found'
        ], 404);
    }

    execute(

        "UPDATE heat_records SET

            animal_id = ?,
            heat_date = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['heat_date'],

            $id
        ]
    );

    json([
        'message' => 'Heat record updated successfully'
    ]);
}

/**
 * DELETE HEAT RECORD
 */
function deleteHeatRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM heat_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Heat record not found'
        ], 404);
    }

    execute(

        "DELETE FROM heat_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Heat record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'heat.php') {
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
                    getHeatRecord($id);
                } else {
                    listHeatRecords();
                }
                break;
            case 'POST':
                createHeatRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateHeatRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteHeatRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}