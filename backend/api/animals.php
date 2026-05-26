<?php
require_once __DIR__ . '/../middleware/jwt.php';

/**
 * Convert empty string to NULL
 */
function nullable($value) {
    return ($value !== '' && $value !== null) ? $value : null;
}

/**
 * Convert Yes/No to 1/0
 */
function yesNoToInt($value, $default = 0) {
    if ($value === true || $value === 1 || $value === '1') return 1;
    if ($value === false || $value === 0 || $value === '0') return 0;

    if (is_string($value)) {
        $v = strtolower(trim($value));
        if ($v === 'yes') return 1;
        if ($v === 'no') return 0;
    }

    return $default;
}

/**
 * LIST ANIMALS
 */
function listAnimals() {
    verifyJWT();

    $search = $_GET['search'] ?? '';
    $breed = $_GET['breed'] ?? '';
    $status = $_GET['status'] ?? '';

    $page = (int)($_GET['page'] ?? 1);
    $limit = 20;
    $offset = ($page - 1) * $limit;

    $where = "WHERE a.is_active = 1";
    $params = [];

    if ($search) {
        $where .= " AND (a.name LIKE ? OR a.tag_number LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }

    if ($breed) {
        $where .= " AND a.breed = ?";
        $params[] = $breed;
    }

    if ($status) {
        $where .= " AND a.status = ?";
        $params[] = $status;
    }

    $total = fetchOne(
        "SELECT COUNT(*) as c FROM animals a $where",
        $params
    )['c'];

    $animals = fetchAll(
        "SELECT a.*,
        (SELECT COALESCE(SUM(quantity_ltr),0)
         FROM milk_records
         WHERE animal_id = a.id
         AND milk_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ) as month_milk,

        (SELECT COUNT(*)
         FROM health_records
         WHERE animal_id = a.id
        ) as health_records_count

        FROM animals a
        $where
        ORDER BY a.created_at DESC
        LIMIT $limit OFFSET $offset",
        $params
    );

    json([
        'animals' => $animals,
        'total' => (int)$total,
        'page' => $page,
        'pages' => ceil($total / $limit)
    ]);
}

/**
 * GET SINGLE ANIMAL
 */
function getAnimal($id) {
    verifyJWT();

    $animal = fetchOne(
        "SELECT * FROM animals WHERE id = ?",
        [$id]
    );

    if (!$animal) {
        json(['error' => 'Animal not found'], 404);
    }

    $milkHistory = fetchAll(
        "SELECT * FROM milk_records
         WHERE animal_id = ?
         ORDER BY milk_date DESC
         LIMIT 30",
        [$id]
    );

    $vaccinations = fetchAll(
        "SELECT * FROM vaccinations
         WHERE animal_id = ?
         ORDER BY vaccine_date DESC",
        [$id]
    );

    $healthRecords = fetchAll(
        "SELECT * FROM health_records
         WHERE animal_id = ?
         ORDER BY record_date DESC",
        [$id]
    );

    $breedingRecords = fetchAll(
        "SELECT * FROM breeding_records
         WHERE animal_id = ?
         ORDER BY breeding_date DESC",
        [$id]
    );

    json([
        'animal' => $animal,
        'milkHistory' => $milkHistory,
        'vaccinations' => $vaccinations,
        'healthRecords' => $healthRecords,
        'breedingRecords' => $breedingRecords
    ]);
}

/**
 * CREATE ANIMAL
 */
function createAnimal($input) {

    $user = verifyJWT();

    $fields = ['tag_number', 'name', 'breed'];

    $errors = validate($fields, $input);

    if ($errors) {
        json(['errors' => $errors], 422);
    }

    $exists = fetchOne(
        "SELECT id FROM animals WHERE tag_number = ?",
        [$input['tag_number']]
    );

    if ($exists) {
        json(['error' => 'Tag number already exists'], 409);
    }

    $id = insert(
        "INSERT INTO animals (

            tag_number,
            name,
            breed,
            animal_type,
            gender,
            date_of_birth,
            farm_entry_date,
            purchase_date,
            purchase_price,
            weight,
            color,
            remarks,
            status,
            milking_now,
            is_calf,
            source,
            health_status,
            pregnancy_status,
            image_url,
            created_by

        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",

        [

            $input['tag_number'],
            $input['name'],
            $input['breed'],

            nullable($input['animal_type'] ?? null),

            $input['gender'] ?? 'female',

            nullable($input['date_of_birth'] ?? null),

            nullable($input['farm_entry_date'] ?? null),

            nullable($input['purchase_date'] ?? null),

            nullable($input['purchase_price'] ?? null),

            nullable($input['weight'] ?? null),

            nullable($input['color'] ?? null),

            nullable($input['remarks'] ?? null),

            $input['status'] ?? 'active',

            yesNoToInt($input['milking_now'] ?? 'Yes', 1),

            yesNoToInt($input['is_calf'] ?? 'No', 0),

            nullable($input['source'] ?? null),

            $input['health_status'] ?? 'healthy',

            $input['pregnancy_status'] ?? 'not_pregnant',

            nullable($input['image_url'] ?? null),

            $user['id']
        ]
    );

    logActivity(
        'created',
        'animals',
        "Added animal: {$input['name']} ({$input['tag_number']})"
    );

    json([
        'message' => 'Animal created',
        'id' => $id
    ], 201);
}

/**
 * UPDATE ANIMAL
 */
function updateAnimal($id, $input) {

    verifyJWT();

    $animal = fetchOne(
        "SELECT id FROM animals WHERE id = ?",
        [$id]
    );

    if (!$animal) {
        json(['error' => 'Animal not found'], 404);
    }

    execute(
        "UPDATE animals SET

            name=?,
            tag_number=?,
            breed=?,
            animal_type=?,
            gender=?,
            date_of_birth=?,
            farm_entry_date=?,
            purchase_date=?,
            purchase_price=?,
            weight=?,
            color=?,
            remarks=?,
            status=?,
            milking_now=?,
            is_calf=?,
            source=?,
            health_status=?,
            pregnancy_status=?,
            image_url=?

         WHERE id=?",

        [

            $input['name'] ?? null,
            $input['tag_number'] ?? null,
            $input['breed'] ?? null,
            nullable($input['animal_type'] ?? null),
            $input['gender'] ?? null,
            nullable($input['date_of_birth'] ?? null),
            nullable($input['farm_entry_date'] ?? null),
            nullable($input['purchase_date'] ?? null),
            nullable($input['purchase_price'] ?? null),
            nullable($input['weight'] ?? null),
            nullable($input['color'] ?? null),
            nullable($input['remarks'] ?? null),
            $input['status'] ?? null,
            yesNoToInt($input['milking_now'] ?? 'No'),
            yesNoToInt($input['is_calf'] ?? 'No'),
            nullable($input['source'] ?? null),
            $input['health_status'] ?? null,
            $input['pregnancy_status'] ?? null,
            nullable($input['image_url'] ?? null),

            $id
        ]
    );

    json(['message' => 'Animal updated']);
}

/**
 * DELETE ANIMAL
 */
function deleteAnimal($id) {

    verifyJWT(['admin']);

    execute(
        "UPDATE animals SET is_active = 0 WHERE id = ?",
        [$id]
    );

    logActivity(
        'deleted',
        'animals',
        "Deactivated animal ID: $id"
    );

    json(['message' => 'Animal deactivated']);
}

/**
 * ACTIVITY LOG
 */
function logActivity($action, $module, $details) {

    $user = verifyJWT();

    execute(
        "INSERT INTO activity_logs
        (user_id, action, module, details)
        VALUES (?,?,?,?)",
        [
            $user['id'],
            $action,
            $module,
            $details
        ]
    );
}

if (basename($_SERVER['SCRIPT_FILENAME']) === 'animals.php') {
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
                    getAnimal($id);
                } else {
                    listAnimals();
                }
                break;
            case 'POST':
                createAnimal($input);
                break;
            case 'PUT':
            case 'PATCH':
                if ($id <= 0) {
                    json(['error' => 'Animal id is required'], 400);
                }
                updateAnimal($id, $input);
                break;
            case 'DELETE':
                if ($id <= 0) {
                    json(['error' => 'Animal id is required'], 400);
                }
                deleteAnimal($id);
                break;
            default:
                json(['error' => 'Method not allowed'], 405);
        }
    } catch (Throwable $e) {
        json(['error' => $e->getMessage()], 500);
    }
}