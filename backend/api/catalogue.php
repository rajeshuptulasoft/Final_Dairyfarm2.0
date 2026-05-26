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
 * LIST CATALOGUE RECORDS
 * Used for showing records in table
 */
function listCatalogueRecords() {

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

            a.animal_type LIKE ?
            OR a.breed LIKE ?
            OR cr.milk_type LIKE ?

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

         FROM catalogue_records cr

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

            cr.id,

            cr.animal_id,

            cr.milk_type,

            cr.fat_percentage,

            cr.lactose_percentage,

            cr.protein_percentage,

            cr.acidity_percentage,

            cr.snf_percentage,

            cr.remarks,

            a.animal_type,

            a.breed,

            a.tag_number,

            a.name AS animal_name

        FROM catalogue_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        $where

        ORDER BY cr.created_at DESC

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
 * GET SINGLE CATALOGUE RECORD
 */
function getCatalogueRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            cr.*,

            a.animal_type,

            a.breed,

            a.name AS animal_name,

            a.tag_number

        FROM catalogue_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        WHERE cr.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Catalogue record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE CATALOGUE RECORD
 * INSERTS INTO DATABASE
 */
function createCatalogueRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'milk_type'

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
            animal_type,
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

        "INSERT INTO catalogue_records (

            animal_id,
            milk_type,
            fat_percentage,
            lactose_percentage,
            protein_percentage,
            acidity_percentage,
            snf_percentage,
            remarks

        ) VALUES (

            ?,?,?,?,?,?,?,?

        )",

        [

            $input['animal_id'],

            $input['milk_type'],

            nullable($input['fat_percentage'] ?? null),

            nullable($input['lactose_percentage'] ?? null),

            nullable($input['protein_percentage'] ?? null),

            nullable($input['acidity_percentage'] ?? null),

            nullable($input['snf_percentage'] ?? null),

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            cr.*,

            a.animal_type,

            a.breed,

            a.name AS animal_name,

            a.tag_number

        FROM catalogue_records cr

        JOIN animals a
        ON a.id = cr.animal_id

        WHERE cr.id = ?",

        [$id]
    );

    json([

        'message' => 'Catalogue record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE CATALOGUE RECORD
 */
function updateCatalogueRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM catalogue_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Catalogue record not found'
        ], 404);
    }

    execute(

        "UPDATE catalogue_records SET

            animal_id = ?,
            milk_type = ?,
            fat_percentage = ?,
            lactose_percentage = ?,
            protein_percentage = ?,
            acidity_percentage = ?,
            snf_percentage = ?,
            remarks = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['milk_type'],

            nullable($input['fat_percentage'] ?? null),

            nullable($input['lactose_percentage'] ?? null),

            nullable($input['protein_percentage'] ?? null),

            nullable($input['acidity_percentage'] ?? null),

            nullable($input['snf_percentage'] ?? null),

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Catalogue record updated successfully'
    ]);
}

/**
 * DELETE CATALOGUE RECORD
 */
function deleteCatalogueRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM catalogue_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Catalogue record not found'
        ], 404);
    }

    execute(

        "DELETE FROM catalogue_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Catalogue record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'catalogue.php') {
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
                    getCatalogueRecord($id);
                } else {
                    listCatalogueRecords();
                }
                break;
            case 'POST':
                createCatalogueRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateCatalogueRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteCatalogueRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}