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
 * LIST DAILY FOOD RECORDS
 * Used for showing records in table
 */
function listDailyFood() {

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
            OR df.item_name LIKE ?

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

         FROM daily_food df

         JOIN animals a
         ON a.id = df.animal_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            df.id,

            df.food_date,

            df.item_name,

            df.quantity,

            df.unit,

            df.time_of_day,

            df.remarks,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        $where

        ORDER BY df.food_date DESC,
                 df.created_at DESC

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
 * GET SINGLE FOOD RECORD
 */
function getDailyFood($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT

            df.*,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        WHERE df.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE DAILY FOOD RECORD
 */
function createDailyFood($input) {

    verifyJWT();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'animal_id',
        'food_date',
        'item_name',
        'quantity'

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

        "INSERT INTO daily_food (

            animal_id,
            food_date,
            item_name,
            quantity,
            unit,
            time_of_day,
            remarks

        ) VALUES (

            ?,?,?,?,?,?,?

        )",

        [

            $input['animal_id'],

            $input['food_date'],

            $input['item_name'],

            $input['quantity'],

            $input['unit'] ?? 'Kg',

            $input['time_of_day'] ?? 'Morning',

            nullable($input['remarks'] ?? null)

        ]
    );

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            df.*,

            a.tag_number,

            a.name AS animal_name

        FROM daily_food df

        JOIN animals a
        ON a.id = df.animal_id

        WHERE df.id = ?",

        [$id]
    );

    json([

        'message' => 'Daily food record created successfully',

        'record' => $record

    ], 201);
}

/**
 * UPDATE DAILY FOOD RECORD
 */
function updateDailyFood($id, $input) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM daily_food
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    execute(

        "UPDATE daily_food SET

            animal_id = ?,
            food_date = ?,
            item_name = ?,
            quantity = ?,
            unit = ?,
            time_of_day = ?,
            remarks = ?

         WHERE id = ?",

        [

            $input['animal_id'],

            $input['food_date'],

            $input['item_name'],

            $input['quantity'],

            $input['unit'] ?? 'Kg',

            $input['time_of_day'] ?? 'Morning',

            nullable($input['remarks'] ?? null),

            $id
        ]
    );

    json([
        'message' => 'Daily food record updated successfully'
    ]);
}

/**
 * DELETE DAILY FOOD RECORD
 */
function deleteDailyFood($id) {

    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM daily_food
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Daily food record not found'
        ], 404);
    }

    execute(

        "DELETE FROM daily_food
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Daily food record deleted successfully'
    ]);
}