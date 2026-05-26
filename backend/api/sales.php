<?php

require_once __DIR__ . '/../middleware/jwt.php';

/**
 * Convert empty string to NULL
 */
function nullable($value)
{
    return ($value !== '' && $value !== null)
        ? $value
        : null;
}

/**
 * Schema helpers for stock deduction + sale unit
 */
function ensureSalesStockTables()
{
    static $ready = false;

    if ($ready) {
        return;
    }

    getDB()->query(

        "CREATE TABLE IF NOT EXISTS sales_stock_deductions (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            sale_id INT UNSIGNED NOT NULL,
            stock_entry_id INT UNSIGNED NOT NULL,
            quantity DECIMAL(12, 2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            KEY idx_sale (sale_id),
            KEY idx_stock_entry (stock_entry_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4"
    );

    $col = fetchOne(

        "SELECT COUNT(*) AS c
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE()
           AND TABLE_NAME = 'sales_records'
           AND COLUMN_NAME = 'unit'"
    );

    if (!(int)($col['c'] ?? 0)) {
        getDB()->query(
            "ALTER TABLE sales_records
             ADD COLUMN unit VARCHAR(20) NULL DEFAULT 'kg' AFTER quantity"
        );
    }

    $ready = true;
}

function normalizeSaleUnit($unit)
{
    $u = strtolower(trim((string)$unit));

    if (in_array($u, ['kg', 'kgs', 'kilogram', 'kilograms'], true)) {
        return 'kg';
    }

    if (in_array($u, ['l', 'ltr', 'litre', 'liter', 'litres', 'liters'], true)) {
        return 'litre';
    }

    return $u;
}

function stockEntryUnitMatches($entryUnit, $saleUnit)
{
    $entryNorm = normalizeSaleUnit($entryUnit !== '' && $entryUnit !== null ? $entryUnit : 'kg');

    return $entryNorm === normalizeSaleUnit($saleUnit);
}

/**
 * Remaining stock for an item (positive entries only, excludes consumption rows)
 */
function getItemStockQuantity($itemId, $unit = null)
{
    ensureSalesStockTables();

    $entries = fetchAll(

        "SELECT quantity, unit
         FROM stock_entries
         WHERE item_id = ?
           AND quantity > 0
           AND (supplier_type IS NULL
                OR supplier_type NOT IN ('Consumption', 'Consumption Reversal'))",

        [$itemId]
    );

    $total = 0.0;

    foreach ($entries as $row) {

        if ($unit !== null && !stockEntryUnitMatches($row['unit'] ?? '', $unit)) {
            continue;
        }

        $total += (float)$row['quantity'];
    }

    return round($total, 2);
}

/**
 * FIFO deduct from stock_entries when a sale is registered
 */
function deductStockForSale($itemId, $quantity, $unit, $saleId)
{
    ensureSalesStockTables();

    $qty = (float)$quantity;

    if ($qty <= 0) {
        throw new Exception('Quantity must be greater than zero');
    }

    $available = getItemStockQuantity($itemId, $unit);

    if ($qty > $available + 0.0001) {
        throw new Exception(
            'Insufficient stock. Available: ' . round($available, 2) . ' ' . normalizeSaleUnit($unit)
        );
    }

    $entries = fetchAll(

        "SELECT id, quantity, unit
         FROM stock_entries
         WHERE item_id = ?
           AND quantity > 0
           AND (supplier_type IS NULL
                OR supplier_type NOT IN ('Consumption', 'Consumption Reversal'))
         ORDER BY entry_date ASC, id ASC",

        [$itemId]
    );

    $remaining = $qty;

    foreach ($entries as $entry) {

        if ($remaining <= 0) {
            break;
        }

        if (!stockEntryUnitMatches($entry['unit'] ?? '', $unit)) {
            continue;
        }

        $entryQty = (float)$entry['quantity'];
        $deduct = min($entryQty, $remaining);
        $newQty = round($entryQty - $deduct, 2);

        execute(

            "UPDATE stock_entries SET quantity = ? WHERE id = ?",

            [$newQty, $entry['id']]
        );

        insert(

            "INSERT INTO sales_stock_deductions (
                sale_id,
                stock_entry_id,
                quantity
            ) VALUES (?, ?, ?)",

            [$saleId, $entry['id'], $deduct]
        );

        $remaining -= $deduct;
    }

    if ($remaining > 0.0001) {
        throw new Exception(
            'Insufficient stock. Available: ' . round($available, 2) . ' ' . normalizeSaleUnit($unit)
        );
    }
}

/**
 * Restore stock when a sale is deleted or updated
 */
function restoreStockForSale($saleId)
{
    ensureSalesStockTables();

    $logs = fetchAll(

        "SELECT stock_entry_id, quantity
         FROM sales_stock_deductions
         WHERE sale_id = ?",

        [$saleId]
    );

    foreach ($logs as $log) {

        execute(

            "UPDATE stock_entries
             SET quantity = quantity + ?
             WHERE id = ?",

            [$log['quantity'], $log['stock_entry_id']]
        );
    }

    execute(

        "DELETE FROM sales_stock_deductions WHERE sale_id = ?",

        [$saleId]
    );
}

/**
 * LIST SALES RECORDS
 */
function listSales()
{
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

            s.customer_name LIKE ?
            OR s.customer_phone LIKE ?
            OR i.item_name LIKE ?

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

         FROM sales_records s

         JOIN items i
         ON i.id = s.item_id

         $where",

        $params

    )['c'];

    /**
     * FETCH RECORDS
     */
    $records = fetchAll(

        "SELECT

            s.id,
            s.sale_date,
            s.customer_name,
            s.customer_phone,
            s.item_id,
            s.quantity,
            s.unit,
            s.rate,
            s.amount,
            s.payment_method,
            s.notes,

            i.item_name,
            i.item_type

        FROM sales_records s

        JOIN items i
        ON i.id = s.item_id

        $where

        ORDER BY s.sale_date DESC,
                 s.created_at DESC

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
 * GET SINGLE SALE RECORD
 */
function getSale($id)
{
    verifyJWT();

    $record = fetchOne(

        "SELECT

            s.*,

            i.item_name,
            i.item_type

        FROM sales_records s

        JOIN items i
        ON i.id = s.item_id

        WHERE s.id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Sale record not found'
        ], 404);
    }

    json([
        'record' => $record
    ]);
}

/**
 * CREATE SALE RECORD
 */
function createSale($input)
{
    verifyJWT();

    ensureSalesStockTables();

    /**
     * REQUIRED FIELDS
     */
    $fields = [

        'sale_date',
        'customer_name',
        'item_id',
        'quantity',
        'rate'

    ];

    $errors = validate($fields, $input);

    if ($errors) {

        json([
            'errors' => $errors
        ], 422);
    }

    $saleUnit = normalizeSaleUnit($input['unit'] ?? 'kg');

    if (!in_array($saleUnit, ['kg', 'litre'], true)) {

        json([
            'error' => 'Unit must be kg or litre'
        ], 422);
    }

    /**
     * CHECK ITEM EXISTS
     */
    $item = fetchOne(

        "SELECT

            id,
            item_name,
            item_type

         FROM items

         WHERE id = ?",

        [$input['item_id']]
    );

    if (!$item) {

        json([
            'error' => 'Item not found'
        ], 404);
    }

    $requestedQty = (float)$input['quantity'];

    $availableStock = getItemStockQuantity($input['item_id'], $saleUnit);

    if ($requestedQty > $availableStock + 0.0001) {

        json([

            'error' => 'Insufficient stock',

            'available_stock' => $availableStock,

            'unit' => $saleUnit

        ], 400);
    }

    /**
     * AUTO CALCULATE AMOUNT
     */
    $amount = (float)$input['quantity'] * (float)$input['rate'];

    /**
     * INSERT RECORD
     */
    $id = insert(

        "INSERT INTO sales_records (

            sale_date,
            customer_name,
            customer_phone,
            item_id,
            quantity,
            unit,
            rate,
            amount,
            payment_method,
            notes

        ) VALUES (

            ?,?,?,?,?,?,?,?,?,?

        )",

        [

            $input['sale_date'],

            $input['customer_name'],

            nullable($input['customer_phone'] ?? null),

            $input['item_id'],

            $input['quantity'],

            $saleUnit,

            $input['rate'],

            $amount,

            $input['payment_method'] ?? 'Cash',

            nullable($input['notes'] ?? null)

        ]
    );

    try {

        deductStockForSale($input['item_id'], $requestedQty, $saleUnit, $id);

    } catch (Throwable $e) {

        execute(

            "DELETE FROM sales_records WHERE id = ?",

            [$id]
        );

        throw $e;
    }

    /**
     * FETCH INSERTED RECORD
     */
    $record = fetchOne(

        "SELECT

            s.*,

            i.item_name,
            i.item_type

        FROM sales_records s

        JOIN items i
        ON i.id = s.item_id

        WHERE s.id = ?",

        [$id]
    );

    json([

        'message' => 'Sale record created successfully',

        'remaining_stock' => getItemStockQuantity($input['item_id'], $saleUnit),

        'unit' => $saleUnit,

        'record' => $record

    ], 201);
}

/**
 * UPDATE SALE RECORD
 */
function updateSale($id, $input)
{
    verifyJWT();

    ensureSalesStockTables();

    $record = fetchOne(

        "SELECT *
         FROM sales_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Sale record not found'
        ], 404);
    }

    $saleUnit = normalizeSaleUnit($input['unit'] ?? $record['unit'] ?? 'kg');

    if (!in_array($saleUnit, ['kg', 'litre'], true)) {

        json([
            'error' => 'Unit must be kg or litre'
        ], 422);
    }

    restoreStockForSale($id);

    $requestedQty = (float)$input['quantity'];

    $availableStock = getItemStockQuantity($input['item_id'], $saleUnit);

    if ($requestedQty > $availableStock + 0.0001) {

        deductStockForSale(
            $record['item_id'],
            (float)$record['quantity'],
            normalizeSaleUnit($record['unit'] ?? 'kg'),
            $id
        );

        json([

            'error' => 'Insufficient stock',

            'available_stock' => $availableStock,

            'unit' => $saleUnit

        ], 400);
    }

    /**
     * AUTO CALCULATE AMOUNT
     */
    $amount = (float)$input['quantity'] * (float)$input['rate'];

    execute(

        "UPDATE sales_records SET

            sale_date = ?,
            customer_name = ?,
            customer_phone = ?,
            item_id = ?,
            quantity = ?,
            unit = ?,
            rate = ?,
            amount = ?,
            payment_method = ?,
            notes = ?

         WHERE id = ?",

        [

            $input['sale_date'],

            $input['customer_name'],

            nullable($input['customer_phone'] ?? null),

            $input['item_id'],

            $input['quantity'],

            $saleUnit,

            $input['rate'],

            $amount,

            $input['payment_method'] ?? 'Cash',

            nullable($input['notes'] ?? null),

            $id
        ]
    );

    deductStockForSale($input['item_id'], $requestedQty, $saleUnit, $id);

    json([
        'message' => 'Sale record updated successfully',
        'remaining_stock' => getItemStockQuantity($input['item_id'], $saleUnit),
        'unit' => $saleUnit
    ]);
}

/**
 * DELETE SALE RECORD
 */
function deleteSale($id)
{
    verifyJWT();

    $record = fetchOne(

        "SELECT id
         FROM sales_records
         WHERE id = ?",

        [$id]
    );

    if (!$record) {

        json([
            'error' => 'Sale record not found'
        ], 404);
    }

    restoreStockForSale($id);

    execute(

        "DELETE FROM sales_records
         WHERE id = ?",

        [$id]
    );

    json([
        'message' => 'Sale record deleted successfully'
    ]);
}

/**
 * PRODUCT DROPDOWN
 */
function listProducts()
{
    verifyJWT();

    ensureSalesStockTables();

    $products = fetchAll(

        "SELECT

            id,
            item_name,
            item_type

         FROM items

         WHERE is_active = 1

         ORDER BY item_name ASC"
    );

    foreach ($products as &$product) {

        $product['available_kg'] = getItemStockQuantity($product['id'], 'kg');
        $product['available_litre'] = getItemStockQuantity($product['id'], 'litre');
    }

    unset($product);

    json([
        'products' => $products
    ]);
}

/**
 * API ROUTER
 */
if (basename($_SERVER['SCRIPT_FILENAME']) === 'sales.php') {

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

            case 'GET':

                if (isset($_GET['products']) && $_GET['products'] == '1') {

                    listProducts();

                } elseif ($id > 0) {

                    getSale($id);

                } else {

                    listSales();
                }

                break;

            case 'POST':

                createSale($input);

                break;

            case 'PUT':
            case 'PATCH':

                if ($id <= 0) {

                    json([
                        'error' => 'Sale id is required'
                    ], 400);
                }

                updateSale($id, $input);

                break;

            case 'DELETE':

                if ($id <= 0) {

                    json([
                        'error' => 'Sale id is required'
                    ], 400);
                }

                deleteSale($id);

                break;

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