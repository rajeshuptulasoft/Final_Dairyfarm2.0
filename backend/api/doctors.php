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
 * LIST DOCTORS
 * SHOW DATA
 */
function listDoctors() {

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

            doctor_name LIKE ?
            OR contact_no LIKE ?
            OR email LIKE ?
            OR address LIKE ?

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

         FROM doctors

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            id,
            doctor_name,
            cost_visit,
            cost_hour,
            cost_online,
            contact_no,
            alt_phone,
            email,
            rating,
            address,
            is_active,
            created_at

        FROM doctors

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
 * GET SINGLE DOCTOR
 */
function getDoctor($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT *

         FROM doctors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Doctor not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE DOCTOR
 * INSERT DATA
 */
function createDoctor($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'doctor_name'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    /**
     * CHECK DUPLICATE
     */
    $exists = fetchOne(

        "SELECT id

         FROM doctors

         WHERE doctor_name = ?",

        [$input['doctor_name']]
    );

    if ($exists) {

        json([
            'error' => 'Doctor already exists'
        ], 409);
    }

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO doctors (

            doctor_name,
            cost_visit,
            cost_hour,
            cost_online,
            contact_no,
            alt_phone,
            email,
            rating,
            address,
            is_active

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['doctor_name'],

            nullable($input['cost_visit'] ?? null),

            nullable($input['cost_hour'] ?? null),

            nullable($input['cost_online'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['alt_phone'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['rating'] ?? null),

            nullable($input['address'] ?? null),

            1

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT *

         FROM doctors

         WHERE id = ?",

        [$id]
    );

    json([

        'message' => 'Doctor created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE DOCTOR
 */
function updateDoctor($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM doctors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Doctor not found'
        ], 404);
    }

    execute(

        "UPDATE doctors SET

            doctor_name = ?,
            cost_visit = ?,
            cost_hour = ?,
            cost_online = ?,
            contact_no = ?,
            alt_phone = ?,
            email = ?,
            rating = ?,
            address = ?,
            is_active = ?

         WHERE id = ?",

        [

            $input['doctor_name'],

            nullable($input['cost_visit'] ?? null),

            nullable($input['cost_hour'] ?? null),

            nullable($input['cost_online'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['alt_phone'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['rating'] ?? null),

            nullable($input['address'] ?? null),

            $input['is_active'] ?? 1,

            $id
        ]
    );

    json([
        'message' => 'Doctor updated successfully'
    ]);
}

/**
 * DELETE DOCTOR
 */
function deleteDoctor($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM doctors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Doctor not found'
        ], 404);
    }

    execute(

        "DELETE FROM doctors

         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Doctor deleted successfully'
    ]);
}

/**
 * API ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'doctors.php') {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }

    header('Content-Type: application/json');
    $method = $_SERVER['REQUEST_METHOD'];

    $input = json_decode(

        file_get_contents('php://input'),

        true

    ) ?? [];

    $id = isset($_GET['id'])

        ? (int) $_GET['id']

        : 0;

    try {

        switch ($method) {

            /**
             * GET
             */
            case 'GET':

                if ($id > 0) {

                    getDoctor($id);

                } else {

                    listDoctors();
                }

                break;

            /**
             * POST
             */
            case 'POST':

                createDoctor($input);

                break;

            /**
             * PUT / PATCH
             */
            case 'PUT':

            case 'PATCH':

                if ($id <= 0) {

                    json([
                        'error' => 'Doctor id is required'
                    ], 400);
                }

                updateDoctor($id, $input);

                break;

            /**
             * DELETE
             */
            case 'DELETE':

                if ($id <= 0) {

                    json([
                        'error' => 'Doctor id is required'
                    ], 400);
                }

                deleteDoctor($id);

                break;

            /**
             * INVALID METHOD
             */
            default:

                json([
                    'error' => 'Method not allowed'
                ], 405);
        }

    } catch (Throwable $e) {

        json([

            'error' => $e->getMessage(),

            'line' => $e->getLine(),

            'file' => $e->getFile()

        ], 500);
    }
}