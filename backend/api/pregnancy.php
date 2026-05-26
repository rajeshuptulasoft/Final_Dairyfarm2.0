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
 * LIST PREGNANCY RECORDS
 * Used for showing records in table
 */
function listPregnancyRecords() {

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

        )";

        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    /**
     * TOTAL RECORDS
     */
    $total = fetchOne(

        "SELECT COUNT(*) as c

         FROM pregnancy_records pr

         JOIN animals a
         ON a.id = pr.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            pr.id,

            pr.animal_id,

            pr.pd_date,

            pr.calv_due_date,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM pregnancy_records pr

        JOIN animals a
        ON a.id = pr.animal_id

        $where

        ORDER BY pr.pd_date DESC,
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
 * GET SINGLE PREGNANCY RECORD
 */
function getPregnancyRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            pr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM pregnancy_records pr

        JOIN animals a
        ON a.id = pr.animal_id

        WHERE pr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Pregnancy record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE PREGNANCY RECORD
 * INSERT DATA INTO DATABASE
 */
function createPregnancyRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'pd_date',
        'calv_due_date'

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
     * INSERT DATA
     */
    $id = insert(

        "INSERT INTO pregnancy_records (

            animal_id,
            pd_date,
            calv_due_date

        ) VALUES (

            ?,?,?

        )",

        [

            $input['animal_id'],

            $input['pd_date'],

            $input['calv_due_date']

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            pr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM pregnancy_records pr

        JOIN animals a
        ON a.id = pr.animal_id

        WHERE pr.id = ?",

        [$id]
    );

    json([

        'message' => 'Pregnancy record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE PREGNANCY RECORD
 */
function updatePregnancyRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM pregnancy_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Pregnancy record not found'
        ], 404);
    }

    execute(

        "UPDATE pregnancy_records SET

            animal_id = ?,
            pd_date = ?,
            calv_due_date = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['pd_date'],

            $input['calv_due_date'],

            $id
        ]
    );

    json([
        'message' => 'Pregnancy record updated successfully'
    ]);
}

/**
 * DELETE PREGNANCY RECORD
 */
function deletePregnancyRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM pregnancy_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Pregnancy record not found'
        ], 404);
    }

    execute(

        "DELETE FROM pregnancy_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Pregnancy record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'pregnancy.php') {
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
                    getPregnancyRecord($id);
                } else {
                    listPregnancyRecords();
                }
                break;
            case 'POST':
                createPregnancyRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updatePregnancyRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deletePregnancyRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}