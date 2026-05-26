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
 * LIST HEALTH RECORDS
 * Used for showing records in table
 */
function listHealthRecords() {

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
            OR hr.doctor_name LIKE ?
            OR hr.symptoms LIKE ?

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

         FROM health_records hr

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

            hr.health_issue_date,

            hr.doctor_name,

            hr.estimated_cost,

            hr.symptoms,

            hr.remedy_taken,

            hr.remedy_suggested,

            hr.doctor_charges,

            hr.paid,

            hr.remarks,

            a.tag_number,

            a.name AS animal_name

        FROM health_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        $where

        ORDER BY hr.health_issue_date DESC,
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
 * GET SINGLE HEALTH RECORD
 */
function getHealthRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            hr.*,

            a.tag_number,

            a.name AS animal_name

        FROM health_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        WHERE hr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Health record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE HEALTH RECORD
 * INSERT DATA INTO DATABASE
 */
function createHealthRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'health_issue_date',
        'doctor_name',
        'symptoms'

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
            name

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

        "INSERT INTO health_records (

            animal_id,
            health_issue_date,
            doctor_name,
            estimated_cost,
            symptoms,
            remedy_taken,
            remedy_suggested,
            doctor_charges,
            paid,
            remarks

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['animal_id'],

            $input['health_issue_date'],

            $input['doctor_name'],

            nullable($input['estimated_cost'] ?? null),

            $input['symptoms'],

            nullable($input['remedy_taken'] ?? null),

            nullable($input['remedy_suggested'] ?? null),

            nullable($input['doctor_charges'] ?? null),

            $input['paid'] ?? 'No',

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            hr.*,

            a.tag_number,

            a.name AS animal_name

        FROM health_records hr

        JOIN animals a
        ON a.id = hr.animal_id

        WHERE hr.id = ?",

        [$id]
    );

    json([

        'message' => 'Health record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE HEALTH RECORD
 */
function updateHealthRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM health_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Health record not found'
        ], 404);
    }

    execute(

        "UPDATE health_records SET

            animal_id = ?,
            health_issue_date = ?,
            doctor_name = ?,
            estimated_cost = ?,
            symptoms = ?,
            remedy_taken = ?,
            remedy_suggested = ?,
            doctor_charges = ?,
            paid = ?,
            remarks = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['health_issue_date'],

            $input['doctor_name'],

            nullable($input['estimated_cost'] ?? null),

            $input['symptoms'],

            nullable($input['remedy_taken'] ?? null),

            nullable($input['remedy_suggested'] ?? null),

            nullable($input['doctor_charges'] ?? null),

            $input['paid'] ?? 'No',

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Health record updated successfully'
    ]);
}

/**
 * DELETE HEALTH RECORD
 */
function deleteHealthRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM health_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Health record not found'
        ], 404);
    }

    execute(

        "DELETE FROM health_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Health record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'health.php') {
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
                    getHealthRecord($id);
                } else {
                    listHealthRecords();
                }
                break;
            case 'POST':
                createHealthRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateHealthRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteHealthRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}