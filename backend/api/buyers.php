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

function normalizeBuyerOrganization($value) {

    if ($value === 'yes' || $value === 'Yes' || $value === true || $value === 1 || $value === '1') {
        return 'Yes';
    }

    return 'No';
}

/**
 * LIST BUYERS
 * SHOW DATA
 */
function listBuyers() {

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

            buyer_name LIKE ?
            OR contact_person LIKE ?
            OR contact_no LIKE ?
            OR email LIKE ?
            OR gst_no LIKE ?

        )";

        $params[] = "%$search%";
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

         FROM buyers

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            id,
            buyer_name,
            is_organization,
            contact_person,
            gst_no,
            max_credit,
            contact_no,
            alt_phone,
            email,
            buyer_to_pay,
            is_active,
            created_at

        FROM buyers

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
 * GET SINGLE BUYER
 */
function getBuyer($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT *

         FROM buyers

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Buyer not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE BUYER
 * INSERT DATA
 */
function createBuyer($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'buyer_name'

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

         FROM buyers

         WHERE buyer_name = ?",

        [$input['buyer_name']]
    );

    if ($exists) {

        json([
            'error' => 'Buyer already exists'
        ], 409);
    }

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO buyers (

            buyer_name,
            is_organization,
            contact_person,
            gst_no,
            max_credit,
            contact_no,
            alt_phone,
            email,
            buyer_to_pay,
            is_active

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['buyer_name'],

            normalizeBuyerOrganization($input['is_organization'] ?? 'No'),

            nullable($input['contact_person'] ?? null),

            nullable($input['gst_no'] ?? null),

            nullable($input['max_credit'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['alt_phone'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['buyer_to_pay'] ?? null),

            1

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT *

         FROM buyers

         WHERE id = ?",

        [$id]
    );

    json([

        'message' => 'Buyer created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE BUYER
 */
function updateBuyer($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM buyers

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Buyer not found'
        ], 404);
    }

    execute(

        "UPDATE buyers SET

            buyer_name = ?,
            is_organization = ?,
            contact_person = ?,
            gst_no = ?,
            max_credit = ?,
            contact_no = ?,
            alt_phone = ?,
            email = ?,
            buyer_to_pay = ?,
            is_active = ?

         WHERE id = ?",

        [

            $input['buyer_name'],

            normalizeBuyerOrganization($input['is_organization'] ?? 'No'),

            nullable($input['contact_person'] ?? null),

            nullable($input['gst_no'] ?? null),

            nullable($input['max_credit'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['alt_phone'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['buyer_to_pay'] ?? null),

            $input['is_active'] ?? 1,

            $id
        ]
    );

    json([
        'message' => 'Buyer updated successfully'
    ]);
}

/**
 * DELETE BUYER
 */
function deleteBuyer($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM buyers

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Buyer not found'
        ], 404);
    }

    execute(

        "DELETE FROM buyers

         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Buyer deleted successfully'
    ]);
}

/**
 * API ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'buyers.php') {
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

                    getBuyer($id);

                } else {

                    listBuyers();
                }

                break;

            /**
             * POST
             */
            case 'POST':

                createBuyer($input);

                break;

            /**
             * PUT / PATCH
             */
            case 'PUT':

            case 'PATCH':

                if ($id <= 0) {

                    json([
                        'error' => 'Buyer id is required'
                    ], 400);
                }

                updateBuyer($id, $input);

                break;

            /**
             * DELETE
             */
            case 'DELETE':

                if ($id <= 0) {

                    json([
                        'error' => 'Buyer id is required'
                    ], 400);
                }

                deleteBuyer($id);

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