CREATE TABLE IF NOT EXISTS sales_stock_deductions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sale_id INT UNSIGNED NOT NULL,
    stock_entry_id INT UNSIGNED NOT NULL,
    quantity DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_sale (sale_id),
    KEY idx_stock_entry (stock_entry_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Run once if sales_records has no unit column:
-- ALTER TABLE sales_records ADD COLUMN unit VARCHAR(20) NULL DEFAULT 'kg' AFTER quantity;
