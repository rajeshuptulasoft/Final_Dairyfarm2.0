-- Tracks which stock_entries were reduced when daily food is logged (for restore on delete/update)
CREATE TABLE IF NOT EXISTS daily_food_stock_deductions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    daily_food_id INT UNSIGNED NOT NULL,
    stock_entry_id INT UNSIGNED NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_daily_food (daily_food_id),
    KEY idx_stock_entry (stock_entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
