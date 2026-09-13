<?php
/**
 * Database Connection & Global Utilities
 * Automated Prepaid Gas Metering Management System
 */

// Production error handling: hide raw errors in JSON
error_reporting(0);
ini_set('display_errors', 0);

// CORS and JSON Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle HTTP OPTIONS Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// -------------------------------------------------------------
// cPanel Database Credentials
// Adjust these 4 parameters to match your cPanel MySQL settings
// -------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'didarmia_agms'); // e.g., cpaneluser_gasmeter
define('DB_USER', 'didarmia_agms');                 // e.g., cpaneluser_meteruser
define('DB_PASS', 'DHM3709#@#');                     // your cPanel DB password
define('DB_PORT', '3306');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
            ensure_location_schema($pdo);
        } catch (PDOException $e) {
            json_response(['error' => 'Database connection failed: ' . $e->getMessage()], 500);
        }
    }
    return $pdo;
}

function ensure_location_schema($pdo) {
    try {
        // 1. Create divisions table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS divisions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 2. Create districts table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS districts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            division_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_dist_div (division_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 3. Create areas table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS areas (
            id INT AUTO_INCREMENT PRIMARY KEY,
            district_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            postal_code VARCHAR(20) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_area_dist (district_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 4. Create projects table if not exists
        $pdo->exec("CREATE TABLE IF NOT EXISTS projects (
            id INT AUTO_INCREMENT PRIMARY KEY,
            area_id INT NULL,
            name VARCHAR(150) NOT NULL,
            code VARCHAR(50) NULL,
            description TEXT NULL,
            status VARCHAR(30) DEFAULT 'ACTIVE',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_proj_area (area_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

        // 5. Ensure zoning columns exist in customers table
        $cols = $pdo->query("SHOW COLUMNS FROM customers LIKE 'division'")->fetchAll();
        if (empty($cols)) {
            $pdo->exec("ALTER TABLE customers 
                ADD COLUMN division VARCHAR(100) NULL AFTER address,
                ADD COLUMN district VARCHAR(100) NULL AFTER division,
                ADD COLUMN area VARCHAR(100) NULL AFTER district,
                ADD COLUMN project_name VARCHAR(150) NULL AFTER area");
        }

        // 6. Seed initial divisions, districts, areas, projects if divisions table is empty
        $divCount = (int)$pdo->query("SELECT COUNT(*) FROM divisions")->fetchColumn();
        if ($divCount === 0) {
            $pdo->exec("INSERT IGNORE INTO divisions (id, name) VALUES
                (1, 'Dhaka'),
                (2, 'Chittagong'),
                (3, 'Sylhet'),
                (4, 'Rajshahi')");

            $pdo->exec("INSERT IGNORE INTO districts (id, division_id, name) VALUES
                (1, 1, 'Dhaka'),
                (2, 1, 'Gazipur'),
                (3, 1, 'Narayanganj'),
                (4, 2, 'Chittagong')");

            $pdo->exec("INSERT IGNORE INTO areas (id, district_id, name, postal_code) VALUES
                (1, 1, 'Dhanmondi', '1205'),
                (2, 1, 'Gulshan', '1212'),
                (3, 1, 'Uttara', '1230'),
                (4, 1, 'Mirpur', '1216'),
                (5, 2, 'Tongi', '1710')");

            $pdo->exec("INSERT IGNORE INTO projects (id, area_id, name, code, description, status) VALUES
                (1, 1, 'Dhanmondi Smart Gas Grid', 'PRJ-DHA-01', 'High-density prepaid residential gas grid', 'ACTIVE'),
                (2, 2, 'Gulshan Heights Pipeline Project', 'PRJ-GUL-02', 'Commercial & luxury residence prepaid grid', 'ACTIVE'),
                (3, 3, 'Uttara Sector 3 Prepaid Piping', 'PRJ-UTT-03', 'Suburban expansion gas distribution', 'ACTIVE'),
                (4, 4, 'Mirpur Block C Zone Project', 'PRJ-MIR-04', 'Urban residential cluster automation', 'ACTIVE')");
        }
    } catch (Exception $e) {
        // Schema checks fail gracefully if permissions or tables already exist
    }
}

function json_response($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function get_json_body() {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        return $_POST;
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}

function log_audit($userId, $action, $details = null) {
    try {
        $db = getDB();
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $stmt = $db->prepare("INSERT INTO audit_logs (user_id, action, details, ip_address, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$userId, $action, $details, $ip]);
    } catch (Exception $e) {
        // Silently continue
    }
}
