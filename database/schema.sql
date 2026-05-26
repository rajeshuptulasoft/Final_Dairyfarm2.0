-- ============================================================
-- Dairy Farm SaaS - Complete MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS dairy_farm_saas;
USE dairy_farm_saas;

-- ===== USERS & AUTH =====
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','manager','employee') DEFAULT 'employee',
  phone VARCHAR(50),
  avatar VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== ANIMALS =====
CREATE TABLE animals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tag_number VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255),
  breed VARCHAR(100),
  animal_type VARCHAR(100),
  gender ENUM('male','female') DEFAULT 'female',
  date_of_birth DATE,
  weight DECIMAL(10,2),
  color VARCHAR(100),
  milking_now TINYINT(1) DEFAULT 1,
  is_calf TINYINT(1) DEFAULT 0,
  remarks TEXT,
  status ENUM('active','sold','dead') NOT NULL DEFAULT 'active',
  purchase_date DATE,
  farm_entry_date DATE,
  purchase_price DECIMAL(12,2),
  source VARCHAR(255),
  health_status ENUM('healthy','sick','recovering','critical') DEFAULT 'healthy',
  pregnancy_status ENUM('not_pregnant','pregnant','lactating','dry') DEFAULT 'not_pregnant',
  lactation_number INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  image_url VARCHAR(500),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== MILK RECORDS =====
CREATE TABLE milk_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  milk_date DATE NOT NULL,
  session ENUM('morning','evening') NOT NULL,
  quantity_ltr DECIMAL(10,2) NOT NULL,
  fat_percentage DECIMAL(5,2),
  notes TEXT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== FEED MANAGEMENT =====
CREATE TABLE feed_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  feed_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  stock_kg DECIMAL(12,2) DEFAULT 0,
  unit_price DECIMAL(10,2),
  supplier VARCHAR(255),
  min_stock_alert DECIMAL(12,2) DEFAULT 50,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE feed_consumption (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT,
  feed_id INT NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  feed_date DATE NOT NULL,
  session ENUM('morning','afternoon','evening') DEFAULT 'morning',
  notes TEXT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (feed_id) REFERENCES feed_inventory(id) ON DELETE CASCADE,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== VACCINATION =====
CREATE TABLE vaccinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccine_date DATE NOT NULL,
  next_due_date DATE,
  doctor_name VARCHAR(255),
  batch_number VARCHAR(100),
  notes TEXT,
  cost DECIMAL(10,2),
  administered_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (administered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== BREEDING =====
CREATE TABLE breeding_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  breeding_date DATE NOT NULL,
  breeding_type ENUM('natural','artificial_insemination') DEFAULT 'natural',
  sire_breed VARCHAR(100),
  sire_tag VARCHAR(50),
  ai_technician VARCHAR(255),
  pregnancy_confirmed TINYINT(1) DEFAULT 0,
  pregnancy_check_date DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  offspring_count INT,
  offspring_details TEXT,
  notes TEXT,
  cost DECIMAL(10,2),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== HEALTH RECORDS =====
CREATE TABLE health_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  animal_id INT NOT NULL,
  record_date DATE NOT NULL,
  record_type ENUM('checkup','treatment','disease','surgery','other') DEFAULT 'checkup',
  diagnosis VARCHAR(500),
  treatment TEXT,
  medicine_prescribed TEXT,
  cost DECIMAL(10,2),
  veterinarian VARCHAR(255),
  follow_up_date DATE,
  status ENUM('ongoing','resolved','referred') DEFAULT 'ongoing',
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== EXPENSES =====
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('feed','medicine','vaccination','salary','maintenance','equipment','utility','transport','other') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT,
  payment_method VARCHAR(50),
  receipt_url VARCHAR(500),
  approved_by INT,
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== REVENUE =====
CREATE TABLE revenue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category ENUM('milk','animal_sale','product_sale','other') NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  revenue_date DATE NOT NULL,
  description TEXT,
  customer_name VARCHAR(255),
  recorded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ===== EMPLOYEE ATTENDANCE =====
CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status ENUM('present','absent','half_day','leave') DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===== NOTIFICATIONS =====
CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('alert','info','warning','success') DEFAULT 'info',
  related_module VARCHAR(50),
  related_id INT,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ===== ACTIVITY LOGS =====
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  module VARCHAR(50),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==== INDEXES FOR PERFORMANCE =====
CREATE INDEX idx_animals_status ON animals(health_status);
CREATE INDEX idx_animals_breed ON animals(breed);
CREATE INDEX idx_milk_date ON milk_records(milk_date);
CREATE INDEX idx_milk_animal ON milk_records(animal_id);
CREATE INDEX idx_feed_date ON feed_consumption(feed_date);
CREATE INDEX idx_vaccination_due ON vaccinations(next_due_date);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_revenue_date ON revenue(revenue_date);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- ===== PRODUCT ENQUIRIES =====
CREATE TABLE product_enquiries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  responded_at TIMESTAMP NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== CONTACT MESSAGES =====
CREATE TABLE contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read TINYINT(1) DEFAULT 0,
  responded_at TIMESTAMP NULL,
  response_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ===== INDEXES FOR ENQUIRIES AND MESSAGES =====
CREATE INDEX idx_enquiries_product ON product_enquiries(product_name);
CREATE INDEX idx_enquiries_created ON product_enquiries(created_at);
CREATE INDEX idx_enquiries_read ON product_enquiries(is_read);
CREATE INDEX idx_messages_email ON contact_messages(email);
CREATE INDEX idx_messages_created ON contact_messages(created_at);
CREATE INDEX idx_messages_read ON contact_messages(is_read);

-- ===== DEFAULT ADMIN =====
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@dairyfarm.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Default password: password
