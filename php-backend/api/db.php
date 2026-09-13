<?php
/**
 * Database Connection Configuration for cPanel Hosting
 * Update these credentials with your cPanel MySQL details
 */

$db_host = 'localhost';
$db_name = 'gas_meter_management'; // Replace with your cPanel DB name (e.g., cpaneluser_gasmeter)
$db_user = 'root';                 // Replace with your cPanel DB user (e.g., cpaneluser_meteruser)
$db_pass = '';                     // Replace with your cPanel DB password

try {
    $pdo = new PDO("mysql:host={$db_host};dbname={$db_name};charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}
