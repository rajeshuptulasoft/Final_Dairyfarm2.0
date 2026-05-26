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
 * LIST CALVING RECORDS
 * Used for showing records in table
 */
function listCalvingRecords() {

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
            OR cr.doctor_name LIKE ?
            OR cr.veterinarian LIKE ?

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

         FROM calving_records cr

         JOIN animals a
         ON a.id = cr.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            cr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM calving_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        $where

        ORDER BY cr.calving_date DESC,
                 cr.created_at DESC

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
 * GET SINGLE CALVING RECORD
 */
function getCalvingRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            cr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM calving_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        WHERE cr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Calving record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE CALVING RECORD
 * INSERT DATA INTO DATABASE
 */
function createCalvingRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'calving_date'

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

        "INSERT INTO calving_records (

            animal_id,

            health_issue_date,
            doctor_name,
            symptoms,
            remedy_taken,
            remedy_suggested,
            estimated_cost,
            doctor_charges,
            paid,

            breeding_date,
            breeding_method,
            sire_info,
            breeding_notes,

            pd_check_date,
            expected_delivery_date,

            calving_date,
            veterinarian,
            calf_count,
            calf_gender,
            calf_weight,
            delivery_type,
            assistance,
            dam_condition,
            calf_condition,

            remarks

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['animal_id'],

            nullable($input['health_issue_date'] ?? null),
            nullable($input['doctor_name'] ?? null),
            nullable($input['symptoms'] ?? null),
            nullable($input['remedy_taken'] ?? null),
            nullable($input['remedy_suggested'] ?? null),
            nullable($input['estimated_cost'] ?? null),
            nullable($input['doctor_charges'] ?? null),
            $input['paid'] ?? 'No',

            nullable($input['breeding_date'] ?? null),
            $input['breeding_method'] ?? 'Natural',
            nullable($input['sire_info'] ?? null),
            nullable($input['breeding_notes'] ?? null),

            nullable($input['pd_check_date'] ?? null),
            nullable($input['expected_delivery_date'] ?? null),

            $input['calving_date'],

            nullable($input['veterinarian'] ?? null),

            $input['calf_count'] ?? 1,

            $input['calf_gender'] ?? 'Female',

            nullable($input['calf_weight'] ?? null),

            $input['delivery_type'] ?? 'Normal',

            $input['assistance'] ?? 'No',

            $input['dam_condition'] ?? 'Healthy',

            $input['calf_condition'] ?? 'Healthy',

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            cr.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM calving_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        WHERE cr.id = ?",

        [$id]
    );

    json([

        'message' => 'Calving record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE CALVING RECORD
 */
function updateCalvingRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM calving_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Calving record not found'
        ], 404);
    }

    execute(

        "UPDATE calving_records SET

            animal_id = ?,

            health_issue_date = ?,
            doctor_name = ?,
            symptoms = ?,
            remedy_taken = ?,
            remedy_suggested = ?,
            estimated_cost = ?,
            doctor_charges = ?,
            paid = ?,

            breeding_date = ?,
            breeding_method = ?,
            sire_info = ?,
            breeding_notes = ?,

            pd_check_date = ?,
            expected_delivery_date = ?,

            calving_date = ?,
            veterinarian = ?,
            calf_count = ?,
            calf_gender = ?,
            calf_weight = ?,
            delivery_type = ?,
            assistance = ?,
            dam_condition = ?,
            calf_condition = ?,

            remarks = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            nullable($input['health_issue_date'] ?? null),
            nullable($input['doctor_name'] ?? null),
            nullable($input['symptoms'] ?? null),
            nullable($input['remedy_taken'] ?? null),
            nullable($input['remedy_suggested'] ?? null),
            nullable($input['estimated_cost'] ?? null),
            nullable($input['doctor_charges'] ?? null),
            $input['paid'] ?? 'No',

            nullable($input['breeding_date'] ?? null),
            $input['breeding_method'] ?? 'Natural',
            nullable($input['sire_info'] ?? null),
            nullable($input['breeding_notes'] ?? null),

            nullable($input['pd_check_date'] ?? null),
            nullable($input['expected_delivery_date'] ?? null),

            $input['calving_date'],

            nullable($input['veterinarian'] ?? null),

            $input['calf_count'] ?? 1,

            $input['calf_gender'] ?? 'Female',

            nullable($input['calf_weight'] ?? null),

            $input['delivery_type'] ?? 'Normal',

            $input['assistance'] ?? 'No',

            $input['dam_condition'] ?? 'Healthy',

            $input['calf_condition'] ?? 'Healthy',

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Calving record updated successfully'
    ]);
}

/**
 * DELETE CALVING RECORD
 */
function deleteCalvingRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM calving_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Calving record not found'
        ], 404);
    }

    execute(

        "DELETE FROM calving_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Calving record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'calved.php') {
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
                    getCalvingRecord($id);
                } else {
                    listCalvingRecords();
                }
                break;
            case 'POST':
                createCalvingRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateCalvingRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteCalvingRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}