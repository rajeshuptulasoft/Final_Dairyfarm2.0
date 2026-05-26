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
 * LIST BREEDING RECORDS
 * Used for showing records in table
 */
function listBreedingRecords() {

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
            OR br.method LIKE ?
            OR br.sire_info LIKE ?

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

         FROM breeding_records br

         JOIN animals a
         ON a.id = br.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            br.id,

            br.animal_id,

            br.breeding_date,

            br.method,

            br.sire_info,

            br.notes,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM breeding_records br

        JOIN animals a
        ON a.id = br.animal_id

        $where

        ORDER BY br.breeding_date DESC,
                 br.created_at DESC

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
 * GET SINGLE BREEDING RECORD
 */
function getBreedingRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            br.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM breeding_records br

        JOIN animals a
        ON a.id = br.animal_id

        WHERE br.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Breeding record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE BREEDING RECORD
 * INSERT DATA INTO DATABASE
 */
function createBreedingRecord($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'breeding_date'

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

        "INSERT INTO breeding_records (

            animal_id,
            breeding_date,
            method,
            sire_info,
            notes

        ) VALUES (

            ?,?,?,?,?

        )",

        [

            $input['animal_id'],

            $input['breeding_date'],

            $input['method'] ?? 'Natural',

            nullable($input['sire_info'] ?? null),

            nullable($input['notes'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            br.*,

            a.tag_number,

            a.name AS animal_name,

            a.breed

        FROM breeding_records br

        JOIN animals a
        ON a.id = br.animal_id

        WHERE br.id = ?",

        [$id]
    );

    json([

        'message' => 'Breeding record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE BREEDING RECORD
 */
function updateBreedingRecord($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM breeding_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Breeding record not found'
        ], 404);
    }

    execute(

        "UPDATE breeding_records SET

            animal_id = ?,
            breeding_date = ?,
            method = ?,
            sire_info = ?,
            notes = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['breeding_date'],

            $input['method'] ?? 'Natural',

            nullable($input['sire_info'] ?? null),

            nullable($input['notes'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Breeding record updated successfully'
    ]);
}

/**
 * DELETE BREEDING RECORD
 */
function deleteBreedingRecord($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM breeding_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Breeding record not found'
        ], 404);
    }

    execute(

        "DELETE FROM breeding_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Breeding record deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'breeding.php') {
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
                    getBreedingRecord($id);
                } else {
                    listBreedingRecords();
                }
                break;
            case 'POST':
                createBreedingRecord($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateBreedingRecord($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteBreedingRecord($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}