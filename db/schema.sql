-- Automated Prepaid Gas Metering Management System
-- Target Database: MySQL / MariaDB (cPanel phpMyAdmin compatible)

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Customers Table (Customer Profile Information)
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    national_id VARCHAR(50) UNIQUE,
    address TEXT,
    division VARCHAR(100) NULL,
    district VARCHAR(100) NULL,
    area VARCHAR(100) NULL,
    project_name VARCHAR(150) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_customer_phone (phone),
    INDEX idx_customer_division (division),
    INDEX idx_customer_district (district)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Users Table (Authentication and Role-Based Access Control)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(30) NOT NULL COMMENT 'SUPER_ADMIN, FIELD_ENGINEER, SUPPORT_STAFF, CONSUMER',
    customer_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Gas Meters Table (Meter Devices & Properties)
CREATE TABLE IF NOT EXISTS gas_meters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meter_number VARCHAR(50) NOT NULL UNIQUE,
    serial_number VARCHAR(50) NOT NULL UNIQUE,
    communication_id VARCHAR(50) NOT NULL UNIQUE,
    firmware_version VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, INACTIVE, REPLACED',
    valve_status VARCHAR(20) DEFAULT 'CLOSED' COMMENT 'OPEN, CLOSED',
    installation_location TEXT,
    customer_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    INDEX idx_meter_number (meter_number),
    INDEX idx_comm_id (communication_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tariffs Table (Pricing details)
CREATE TABLE IF NOT EXISTS tariffs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    unit_price DECIMAL(10, 4) NOT NULL,
    vat_percentage DECIMAL(5, 2) DEFAULT 0.00,
    fixed_charge DECIMAL(10, 2) DEFAULT 0.00,
    service_charge DECIMAL(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Recharges Table (Payment & recharge token transaction history)
CREATE TABLE IF NOT EXISTS recharges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meter_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    token VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL COMMENT 'CREDIT_CARD, MOBILE_BANKING, WALLET',
    status VARCHAR(20) DEFAULT 'PENDING' COMMENT 'PENDING, SUCCESSFUL, FAILED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meter_id) REFERENCES gas_meters(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_recharge_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Consumption Table (Daily usage log and telemetry data)
CREATE TABLE IF NOT EXISTS consumption (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meter_id INT NOT NULL,
    daily_usage DECIMAL(10, 3) NOT NULL COMMENT 'Gas consumed in Cubic Meters (m³)',
    remaining_balance DECIMAL(10, 2) NOT NULL COMMENT 'Monetary credit remaining',
    meter_reading DECIMAL(12, 3) NOT NULL COMMENT 'Cumulative reading index',
    pressure DECIMAL(8, 2) COMMENT 'Gas pressure in kPa',
    temperature DECIMAL(5, 2) COMMENT 'Gas temperature in Celsius',
    recorded_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meter_id) REFERENCES gas_meters(id) ON DELETE CASCADE,
    UNIQUE KEY uq_meter_date (meter_id, recorded_date),
    INDEX idx_recorded_date (recorded_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Communication Logs (Raw package telemetry logging)
CREATE TABLE IF NOT EXISTS communication_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meter_id INT,
    direction VARCHAR(10) NOT NULL COMMENT 'INCOMING, OUTGOING',
    packet_data TEXT NOT NULL COMMENT 'Hex or raw payload representation',
    status VARCHAR(20) NOT NULL COMMENT 'SUCCESS, ERROR, RETRY',
    retry_count INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (meter_id) REFERENCES gas_meters(id) ON DELETE SET NULL,
    INDEX idx_log_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Audit Logs (User activity and system events)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Divisions Table (Top-level geographic zones)
CREATE TABLE IF NOT EXISTS divisions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Districts Table (Belongs to Division)
CREATE TABLE IF NOT EXISTS districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    division_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (division_id) REFERENCES divisions(id) ON DELETE CASCADE,
    INDEX idx_dist_div (division_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Areas Table (Belongs to District, e.g. Upazila, Thana, or Neighborhood Zone)
CREATE TABLE IF NOT EXISTS areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    INDEX idx_area_dist (district_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Projects Table (Belongs to Area, represents piping/grid projects)
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NULL,
    description TEXT NULL,
    status VARCHAR(30) DEFAULT 'ACTIVE' COMMENT 'ACTIVE, PLANNING, COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE SET NULL,
    INDEX idx_proj_area (area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial System Seed Data (Default Admin, Field Engineer, Support Staff, Consumer, and Default Tariff)
-- Default Passwords: admin123 / engineer123 / support123 / consumer123 (BCrypt Hash: $2a$10$e8wFhI/KzM5y1qjS01eEre4sV0d1t.o2bFq2m8uBfP8i9L1h2e3gK)
INSERT IGNORE INTO divisions (id, name) VALUES
(1, 'Dhaka'),
(2, 'Chittagong'),
(3, 'Sylhet'),
(4, 'Rajshahi');

INSERT IGNORE INTO districts (id, division_id, name) VALUES
(1, 1, 'Dhaka'),
(2, 1, 'Gazipur'),
(3, 1, 'Narayanganj'),
(4, 2, 'Chittagong');

INSERT IGNORE INTO areas (id, district_id, name, postal_code) VALUES
(1, 1, 'Dhanmondi', '1205'),
(2, 1, 'Gulshan', '1212'),
(3, 1, 'Uttara', '1230'),
(4, 1, 'Mirpur', '1216'),
(5, 2, 'Tongi', '1710');

INSERT IGNORE INTO projects (id, area_id, name, code, description, status) VALUES
(1, 1, 'Dhanmondi Smart Gas Grid', 'PRJ-DHA-01', 'High-density prepaid residential gas grid', 'ACTIVE'),
(2, 2, 'Gulshan Heights Pipeline Project', 'PRJ-GUL-02', 'Commercial & luxury residence prepaid grid', 'ACTIVE'),
(3, 3, 'Uttara Sector 3 Prepaid Piping', 'PRJ-UTT-03', 'Suburban expansion gas distribution', 'ACTIVE'),
(4, 4, 'Mirpur Block C Zone Project', 'PRJ-MIR-04', 'Urban residential cluster automation', 'ACTIVE');

INSERT IGNORE INTO customers (id, first_name, last_name, email, phone, national_id, address, division, district, area, project_name)
VALUES (1, 'Arifur', 'Rahman', 'consumer@gasflow.local', '+8801700000001', 'NID-1988273641', 'House 14, Road 5', 'Dhaka', 'Dhaka', 'Dhanmondi', 'Dhanmondi Smart Gas Grid');

INSERT IGNORE INTO users (id, username, password_hash, email, role, customer_id) 
VALUES 
(1, 'superadmin', '$2a$10$e8wFhI/KzM5y1qjS01eEre4sV0d1t.o2bFq2m8uBfP8i9L1h2e3gK', 'superadmin@gasflow.local', 'SUPER_ADMIN', NULL),
(2, 'engineer', '$2a$10$e8wFhI/KzM5y1qjS01eEre4sV0d1t.o2bFq2m8uBfP8i9L1h2e3gK', 'engineer@gasflow.local', 'FIELD_ENGINEER', NULL),
(3, 'support', '$2a$10$e8wFhI/KzM5y1qjS01eEre4sV0d1t.o2bFq2m8uBfP8i9L1h2e3gK', 'support@gasflow.local', 'SUPPORT_STAFF', NULL),
(4, 'consumer', '$2a$10$e8wFhI/KzM5y1qjS01eEre4sV0d1t.o2bFq2m8uBfP8i9L1h2e3gK', 'consumer@gasflow.local', 'CONSUMER', 1);

INSERT IGNORE INTO tariffs (id, name, unit_price, vat_percentage, fixed_charge, service_charge, is_active)
VALUES (1, 'Standard Residential Plan', 0.8500, 5.00, 2.50, 1.00, TRUE);

SET FOREIGN_KEY_CHECKS = 1;
