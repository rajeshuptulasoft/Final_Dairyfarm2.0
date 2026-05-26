<?php
/**
 * One-time migration: adds Register Animal form columns.
 * Run: php migrate_animals.php
 */
require_once __DIR__ . '/config/database.php';

$columns = [
    "animal_type VARCHAR(100) NULL AFTER breed",
    "farm_entry_date DATE NULL AFTER purchase_date",
    "milking_now TINYINT(1) DEFAULT 1 AFTER color",
    "is_calf TINYINT(1) DEFAULT 0 AFTER milking_now",
    "remarks TEXT NULL AFTER is_calf",
    "status ENUM('active','sold','dead') NOT NULL DEFAULT 'active' AFTER remarks",
];

$db = getDB();
$existing = [];
$res = $db->query('DESCRIBE animals');
while ($row = $res->fetch_assoc()) {
    $existing[$row['Field']] = true;
}

foreach ($columns as $def) {
    $name = preg_match('/^(\w+)/', $def, $m) ? $m[1] : null;
    if (!$name || isset($existing[$name])) {
        echo "Skip (exists): $name\n";
        continue;
    }
    $sql = "ALTER TABLE animals ADD COLUMN $def";
    if (!$db->query($sql)) {
        echo "Failed: $sql — " . $db->error . "\n";
        exit(1);
    }
    echo "Added: $name\n";
}

echo "Migration complete.\n";
