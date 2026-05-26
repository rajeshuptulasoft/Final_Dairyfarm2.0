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
 * LIST VENDORS
 * SHOW DATA
 */
function listVendors() {

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

            vendor_name LIKE ?
            OR organization LIKE ?
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

         FROM vendors

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            id,
            vendor_name,
            organization,
            gst_no,
            contact_no,
            email,
            max_credit,
            to_pay,
            alt_phone,
            is_active,
            created_at

        FROM vendors

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
 * GET SINGLE VENDOR
 */
function getVendor($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT *

         FROM vendors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Vendor not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE VENDOR
 * INSERT DATA
 */
function createVendor($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'vendor_name'

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

         FROM vendors

         WHERE vendor_name = ?",

        [$input['vendor_name']]
    );

    if ($exists) {

        json([
            'error' => 'Vendor already exists'
        ], 409);
    }

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO vendors (

            vendor_name,
            organization,
            gst_no,
            contact_no,
            email,
            max_credit,
            to_pay,
            alt_phone,
            is_active

        ) VALUES (

            ?,?,?,?,?,?,?,?,?

        )",

        [

            $input['vendor_name'],

            nullable($input['organization'] ?? null),

            nullable($input['gst_no'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['max_credit'] ?? null),

            nullable($input['to_pay'] ?? null),

            nullable($input['alt_phone'] ?? null),

            1

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT *

         FROM vendors

         WHERE id = ?",

        [$id]
    );

    json([

        'message' => 'Vendor created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE VENDOR
 */
function updateVendor($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM vendors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Vendor not found'
        ], 404);
    }

    execute(

        "UPDATE vendors SET

            vendor_name = ?,
            organization = ?,
            gst_no = ?,
            contact_no = ?,
            email = ?,
            max_credit = ?,
            to_pay = ?,
            alt_phone = ?,
            is_active = ?

         WHERE id = ?",

        [

            $input['vendor_name'],

            nullable($input['organization'] ?? null),

            nullable($input['gst_no'] ?? null),

            nullable($input['contact_no'] ?? null),

            nullable($input['email'] ?? null),

            nullable($input['max_credit'] ?? null),

            nullable($input['to_pay'] ?? null),

            nullable($input['alt_phone'] ?? null),

            $input['is_active'] ?? 1,

            $id
        ]
    );

    json([
        'message' => 'Vendor updated successfully'
    ]);
}

/**
 * DELETE VENDOR
 */
function deleteVendor($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM vendors

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Vendor not found'
        ], 404);
    }

    execute(

        "DELETE FROM vendors

         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Vendor deleted successfully'
    ]);
}

/**
 * API ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'vendors.php') {
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

                    getVendor($id);

                } else {

                    listVendors();
                }

                break;

            /**
             * POST
             */
            case 'POST':

                createVendor($input);

                break;

            /**
             * PUT / PATCH
             */
            case 'PUT':

            case 'PATCH':

                if ($id <= 0) {

                    json([
                        'error' => 'Vendor id is required'
                    ], 400);
                }

                updateVendor($id, $input);

                break;

            /**
             * DELETE
             */
            case 'DELETE':

                if ($id <= 0) {

                    json([
                        'error' => 'Vendor id is required'
                    ], 400);
                }

                deleteVendor($id);

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