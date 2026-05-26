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
 * LIST DAILY MILK RECORDS
 * This is used for showing records in table
 */
function listMilkRecords() {

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
            OR mr.milk_type LIKE ?
            OR mr.collected_by LIKE ?

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

         FROM milk_records mr

         JOIN animals a
         ON a.id = mr.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            mr.id,

            mr.milk_date,

            mr.fat_percentage,

            mr.lactose_percentage,

            mr.protein_percentage,

            mr.milk_type,

            mr.acidity_percentage,

            mr.quantity_ltr,

            mr.snf_percentage,

            mr.unit,

            mr.remarks,

            mr.time_of_day,

            mr.collected_by,

            a.tag_number,

            a.name AS animal_name

        FROM milk_records mr

        JOIN animals a
        ON a.id = mr.animal_id

        $where

        ORDER BY mr.milk_date DESC,
                 mr.created_at DESC

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
 * GET SINGLE RECORD
 */
function getMilkRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            mr.*,

            a.tag_number,

            a.name AS animal_name

        FROM milk_records mr

        JOIN animals a
        ON a.id = mr.animal_id

        WHERE mr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Milk record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE MILK RECORD
 */
function createMilkRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'milk_date',
        'milk_type',
        'quantity_ltr'

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

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO milk_records (

            animal_id,
            milk_date,
            milk_type,
            quantity_ltr,
            unit,
            fat_percentage,
            lactose_percentage,
            protein_percentage,
            acidity_percentage,
            snf_percentage,
            time_of_day,
            remarks,
            collected_by

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['animal_id'],

            $input['milk_date'],

            $input['milk_type'],

            $input['quantity_ltr'],

            $input['unit'] ?? 'Kg',

            nullable($input['fat_percentage'] ?? null),

            nullable($input['lactose_percentage'] ?? null),

            nullable($input['protein_percentage'] ?? null),

            nullable($input['acidity_percentage'] ?? null),

            nullable($input['snf_percentage'] ?? null),

            $input['time_of_day'] ?? 'Morning',

            nullable($input['remarks'] ?? null),

            nullable($input['collected_by'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            mr.*,

            a.tag_number,

            a.name AS animal_name

        FROM milk_records mr

        JOIN animals a
        ON a.id = mr.animal_id

        WHERE mr.id = ?",

        [$id]
    );

    json([

        'message' => 'Milk record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE MILK RECORD
 */
function updateMilkRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM milk_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Milk record not found'
        ], 404);
    }

    execute(

        "UPDATE milk_records SET

            animal_id = ?,
            milk_date = ?,
            milk_type = ?,
            quantity_ltr = ?,
            unit = ?,
            fat_percentage = ?,
            lactose_percentage = ?,
            protein_percentage = ?,
            acidity_percentage = ?,
            snf_percentage = ?,
            time_of_day = ?,
            remarks = ?,
            collected_by = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['milk_date'],

            $input['milk_type'],

            $input['quantity_ltr'],

            $input['unit'] ?? 'Kg',

            nullable($input['fat_percentage'] ?? null),

            nullable($input['lactose_percentage'] ?? null),

            nullable($input['protein_percentage'] ?? null),

            nullable($input['acidity_percentage'] ?? null),

            nullable($input['snf_percentage'] ?? null),

            $input['time_of_day'] ?? 'Morning',

            nullable($input['remarks'] ?? null),

            nullable($input['collected_by'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Milk record updated successfully'
    ]);
}

/**
 * DELETE MILK RECORD
 */
function deleteMilkRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM milk_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Milk record not found'
        ], 404);
    }

    execute(

        "DELETE FROM milk_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Milk record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'dailymilk.php') {
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
                    getMilkRecord($id);
                } else {
                    listMilkRecords();
                }
                break;
            case 'POST':
                createMilkRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateMilkRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteMilkRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}