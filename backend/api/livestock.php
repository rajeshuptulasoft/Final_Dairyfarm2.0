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
 * Resolve base fodder from item id or legacy slug/name (e.g. "chokada")
 */
function resolveBaseFodderItemId($input) {

    if (!empty($input['base_fodder_item_id'])) {
        return (int)$input['base_fodder_item_id'];
    }

    if (empty($input['base_fodder'])) {
        return null;
    }

    $slug = strtolower(trim((string)$input['base_fodder']));

    $item = fetchOne(

        "SELECT id FROM items
         WHERE LOWER(item_name) = ?
            OR LOWER(REPLACE(item_name, ' ', '')) = REPLACE(?, ' ', '')
            OR LOWER(item_name) LIKE ?
         LIMIT 1",

        [$slug, $slug, '%' . $slug . '%']
    );

    return $item ? (int)$item['id'] : null;
}

/**
 * pregnancy_span must match DB enum: Days, Months, Years
 */
function normalizePregnancySpan($value) {

    $span = $value ?? 'Days';

    if ($span === 'Weeks') {
        return 'Days';
    }

    if (!in_array($span, ['Days', 'Months', 'Years'], true)) {
        return 'Days';
    }

    return $span;
}

/**
 * Bind values for INSERT/UPDATE (same column order)
 */
function livestockBindParams($input) {

    return [

        $input['livestock_type'],

        nullable(resolveBaseFodderItemId($input)),

        $input['group_name'],

        nullable($input['breed'] ?? null),

        !empty($input['milking']) ? $input['milking'] : 'No',

        nullable($input['delivers'] ?? null),

        nullable($input['pregnancy_duration'] ?? null),

        normalizePregnancySpan($input['pregnancy_span'] ?? null),

        nullable($input['daily_feed_count'] ?? null),

        nullable($input['feed_time_01'] ?? null),
        nullable($input['feed_time_02'] ?? null),
        nullable($input['feed_time_03'] ?? null),
        nullable($input['feed_time_04'] ?? null),
        nullable($input['feed_time_05'] ?? null),

        nullable($input['daily_normal_feed_qty'] ?? null),

        $input['daily_normal_feed_unit'] ?? 'Kg',

        nullable($input['daily_pregnant_feed_qty'] ?? null),

        $input['daily_pregnant_feed_unit'] ?? 'Kg',

        nullable($input['daily_calf_feed_qty'] ?? null),

        $input['daily_calf_feed_unit'] ?? 'Kg',

    ];
}

/**
 * LIST LIVESTOCK SETTINGS
 */
function listLivestockSettings() {

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

            ls.livestock_type LIKE ?
            OR ls.group_name LIKE ?
            OR ls.breed LIKE ?
            OR i.item_name LIKE ?

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

         FROM livestock_settings ls

         LEFT JOIN items i
         ON i.id = ls.base_fodder_item_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            ls.*,

            i.item_name AS base_fodder_name

        FROM livestock_settings ls

        LEFT JOIN items i
        ON i.id = ls.base_fodder_item_id

        $where

        ORDER BY ls.created_at DESC

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
 * GET SINGLE LIVESTOCK RECORD
 */
function getLivestockSetting($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            ls.*,

            i.item_name AS base_fodder_name

        FROM livestock_settings ls

        LEFT JOIN items i
        ON i.id = ls.base_fodder_item_id

        WHERE ls.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Livestock setting not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE LIVESTOCK RECORD
 */
function createLivestockSetting($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'livestock_type',
        'group_name'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    $baseFodderId = resolveBaseFodderItemId($input);

    if ($baseFodderId) {

        $item = fetchOne(

            "SELECT id, item_name FROM items WHERE id = ?",

            [$baseFodderId]
        );

        if (!$item) {

            json([
                'error' => 'Base fodder item not found'
            ], 404);
        }
    }

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO livestock_settings (

            livestock_type,
            base_fodder_item_id,
            group_name,
            breed,
            milking,
            delivers,
            pregnancy_duration,
            pregnancy_span,
            daily_feed_count,

            feed_time_01,
            feed_time_02,
            feed_time_03,
            feed_time_04,
            feed_time_05,

            daily_normal_feed_qty,
            daily_normal_feed_unit,

            daily_pregnant_feed_qty,
            daily_pregnant_feed_unit,

            daily_calf_feed_qty,
            daily_calf_feed_unit

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?

        )",

        livestockBindParams($input)
    );

    if (!$id) {
        json([
            'error' => 'Failed to create livestock setting: ' . getDB()->error
        ], 500);
    }

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            ls.*,

            i.item_name AS base_fodder_name

        FROM livestock_settings ls

        LEFT JOIN items i
        ON i.id = ls.base_fodder_item_id

        WHERE ls.id = ?",

        [$id]
    );

    if (!$record) {
        json([
            'error' => 'Livestock setting was created but could not be loaded'
        ], 500);
    }

    json([

        'message' => 'Livestock setting created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE LIVESTOCK RECORD
 */
function updateLivestockSetting($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM livestock_settings

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Livestock setting not found'
        ], 404);
    }

    execute(

        "UPDATE livestock_settings SET

            livestock_type = ?,
            base_fodder_item_id = ?,
            group_name = ?,
            breed = ?,
            milking = ?,
            delivers = ?,
            pregnancy_duration = ?,
            pregnancy_span = ?,
            daily_feed_count = ?,

            feed_time_01 = ?,
            feed_time_02 = ?,
            feed_time_03 = ?,
            feed_time_04 = ?,
            feed_time_05 = ?,

            daily_normal_feed_qty = ?,
            daily_normal_feed_unit = ?,

            daily_pregnant_feed_qty = ?,
            daily_pregnant_feed_unit = ?,

            daily_calf_feed_qty = ?,
            daily_calf_feed_unit = ?

         WHERE id = ?",

        array_merge(livestockBindParams($input), [$id])
    );

    json([
        'message' => 'Livestock setting updated successfully'
    ]);
}

/**
 * DELETE LIVESTOCK RECORD
 */
function deleteLivestockSetting($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id

         FROM livestock_settings

         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Livestock setting not found'
        ], 404);
    }

    execute(

        "DELETE FROM livestock_settings

         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Livestock setting deleted successfully'
    ]);
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'livestock.php') {
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
                    getLivestockSetting($id);
                } else {
                    listLivestockSettings();
                }
                break;
            case 'POST':
                createLivestockSetting($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                updateLivestockSetting($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Record id is required'], 400);
                }
                deleteLivestockSetting($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}
