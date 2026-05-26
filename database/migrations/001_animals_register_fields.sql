-- Add columns required by the Register Animal form (frontend)
USE dairy_farm_saas;

ALTER TABLE animals
  ADD COLUMN IF NOT EXISTS animal_type VARCHAR(100) NULL AFTER breed,
  ADD COLUMN IF NOT EXISTS farm_entry_date DATE NULL AFTER purchase_date,
  ADD COLUMN IF NOT EXISTS milking_now TINYINT(1) DEFAULT 1 AFTER color,
  ADD COLUMN IF NOT EXISTS is_calf TINYINT(1) DEFAULT 0 AFTER milking_now,
  ADD COLUMN IF NOT EXISTS remarks TEXT NULL AFTER is_calf,
  ADD COLUMN IF NOT EXISTS status ENUM('active','sold','dead') NOT NULL DEFAULT 'active' AFTER remarks;
