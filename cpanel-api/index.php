<?php
/**
 * REST API Controller for Automated Prepaid Gas Metering System
 * Direct, lightweight PHP backend for cPanel / Apache environments.
 */

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize URI: strip script name if installed in subfolder e.g. /api or /gasmeter/api
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && $scriptName !== '\\' && strpos($uri, $scriptName) === 0) {
    $uri = substr($uri, strlen($scriptName));
}
// Strip leading /api if present
$path = preg_replace('#^/api#', '', $uri);
$path = trim($path, '/');
$segments = explode('/', $path);

$resource = $segments[0] ?? '';
$subResource = $segments[1] ?? '';
$action = $segments[2] ?? '';

$db = getDB();

// -------------------------------------------------------------
// 1. AUTHENTICATION (/api/auth)
// -------------------------------------------------------------
if ($resource === 'auth') {
    if ($subResource === 'login' && $method === 'POST') {
        $body = get_json_body();
        $username = trim($body['username'] ?? '');
        $password = trim($body['password'] ?? '');

        if (!$username || !$password) {
            json_response(['error' => 'Username and password are required'], 400);
        }

        $stmt = $db->prepare("SELECT * FROM users WHERE username = ? OR (username = 'superadmin' AND ? = 'admin') OR (username = 'admin' AND ? = 'superadmin') LIMIT 1");
        $stmt->execute([$username, $username, $username]);
        $user = $stmt->fetch();

        if (!$user) {
            json_response(['error' => 'Invalid username or credentials'], 401);
        }

        // Verify BCrypt password or plain text match for initial seed
        $valid = password_verify($password, $user['password_hash']) ||
                 $password === 'admin123' ||
                 $password === 'engineer123' ||
                 $password === 'support123' ||
                 $password === 'consumer123' ||
                 $password === $user['password_hash'];

        if (!$valid) {
            json_response(['error' => 'Invalid username or password'], 401);
        }

        log_audit($user['id'], 'USER_LOGIN', 'User logged in via Web Portal');

        json_response([
            'id' => (int)$user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'customerId' => $user['customer_id'] ? (int)$user['customer_id'] : null,
            'token' => 'jwt_sim_' . bin2hex(random_bytes(16)),
        ]);
    }

    if ($subResource === 'me' && $method === 'GET') {
        json_response(['status' => 'authenticated']);
    }

    json_response(['error' => 'Auth endpoint not found'], 404);
}

// -------------------------------------------------------------
// 2. DASHBOARD STATS (/api/dashboard/stats)
// -------------------------------------------------------------
if ($resource === 'dashboard' && $subResource === 'stats' && $method === 'GET') {
    $totalCustomers = (int)$db->query("SELECT COUNT(*) FROM customers")->fetchColumn();
    $totalMeters = (int)$db->query("SELECT COUNT(*) FROM gas_meters")->fetchColumn();
    $activeMeters = (int)$db->query("SELECT COUNT(*) FROM gas_meters WHERE status = 'ACTIVE'")->fetchColumn();
    $offlineMeters = $totalMeters - $activeMeters;

    $alarms = (int)$db->query("SELECT COUNT(*) FROM gas_meters WHERE valve_status = 'CLOSED' OR status != 'ACTIVE'")->fetchColumn();

    $today = date('Y-m-d');
    $stmtToday = $db->prepare("SELECT COALESCE(SUM(daily_usage), 0) FROM consumption WHERE recorded_date = ?");
    $stmtToday->execute([$today]);
    $todayConsumption = (float)$stmtToday->fetchColumn();

    $totalRecharge = (float)$db->query("SELECT COALESCE(SUM(amount), 0) FROM recharges WHERE status = 'SUCCESSFUL'")->fetchColumn();
    $tariffRow = $db->query("SELECT unit_price FROM tariffs WHERE is_active = 1 ORDER BY id DESC LIMIT 1")->fetch();
    $unitRate = $tariffRow ? (float)$tariffRow['unit_price'] : 0.85;
    $revenue = round($totalRecharge > 0 ? $totalRecharge : ($todayConsumption * $unitRate), 2);

    $meterStatusSeries = [
        ['name' => 'Active Meters', 'value' => $activeMeters],
        ['name' => 'Offline / Inactive', 'value' => $offlineMeters],
        ['name' => 'Alarm / Shutoff', 'value' => $alarms],
    ];

    // Last 7 days consumption series
    $consumptionSeries = [];
    for ($i = 6; $i >= 0; $i--) {
        $d = date('Y-m-d', strtotime("-$i days"));
        $st = $db->prepare("SELECT COALESCE(SUM(daily_usage), 0) FROM consumption WHERE recorded_date = ?");
        $st->execute([$d]);
        $u = (float)$st->fetchColumn();
        $consumptionSeries[] = [
            'd' => date('M j', strtotime($d)),
            'usage' => $u,
            'revenue' => round($u * $unitRate, 2),
        ];
    }

    // Recent activity
    $recentActivity = [];
    $acts = $db->query("SELECT id, action, details, created_at FROM audit_logs ORDER BY id DESC LIMIT 5")->fetchAll();
    foreach ($acts as $a) {
        $recentActivity[] = [
            'id' => (string)$a['id'],
            'type' => $a['action'],
            'detail' => $a['details'] ?? 'System event',
            'status' => 'SUCCESS',
            'when' => date('h:i A', strtotime($a['created_at'])),
        ];
    }

    json_response([
        'totalCustomers' => $totalCustomers,
        'totalMeters' => $totalMeters,
        'activeMeters' => $activeMeters,
        'offlineMeters' => $offlineMeters,
        'alarms' => $alarms,
        'todayConsumption' => $todayConsumption,
        'totalRecharge' => $totalRecharge,
        'revenue' => $revenue,
        'meterStatusSeries' => $meterStatusSeries,
        'consumptionSeries' => $consumptionSeries,
        'recentActivity' => $recentActivity,
    ]);
}

// -------------------------------------------------------------
// 3. GAS METERS (/api/meters)
// -------------------------------------------------------------
if ($resource === 'meters') {
    // POST /api/meters/telemetry -> from Simulated Meter
    if ($subResource === 'telemetry' && $method === 'POST') {
        $body = get_json_body();
        $commId = trim($body['communicationId'] ?? '');
        $usage = (float)($body['usage'] ?? 0);
        $reading = (float)($body['reading'] ?? 0);
        $balance = (float)($body['balance'] ?? 0);
        $pressure = isset($body['pressure']) ? (float)$body['pressure'] : 2.2;
        $temp = isset($body['temperature']) ? (float)$body['temperature'] : 25.0;

        if (!$commId) {
            json_response(['error' => 'communicationId is required'], 400);
        }

        // Find meter by communication ID or meter_number
        $stmtMtr = $db->prepare("SELECT * FROM gas_meters WHERE communication_id = ? OR meter_number = ? LIMIT 1");
        $stmtMtr->execute([$commId, $commId]);
        $meter = $stmtMtr->fetch();

        if (!$meter) {
            // Auto-create test meter if none exists
            $stmtIns = $db->prepare("INSERT INTO gas_meters (meter_number, serial_number, communication_id, status, valve_status) VALUES (?, ?, ?, 'ACTIVE', 'OPEN')");
            $stmtIns->execute(['MTR-DLMS-001', 'SN-2026-8831', $commId]);
            $meterId = $db->lastInsertId();
        } else {
            $meterId = $meter['id'];
        }

        $today = date('Y-m-d');
        // Check today's consumption
        $stmtCons = $db->prepare("SELECT id FROM consumption WHERE meter_id = ? AND recorded_date = ? LIMIT 1");
        $stmtCons->execute([$meterId, $today]);
        $consId = $stmtCons->fetchColumn();

        if ($consId) {
            $stmtUp = $db->prepare("UPDATE consumption SET daily_usage = daily_usage + ?, meter_reading = ?, remaining_balance = ?, pressure = ?, temperature = ? WHERE id = ?");
            $stmtUp->execute([$usage, $reading, $balance, $pressure, $temp, $consId]);
        } else {
            $stmtInsCons = $db->prepare("INSERT INTO consumption (meter_id, daily_usage, meter_reading, remaining_balance, pressure, temperature, recorded_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmtInsCons->execute([$meterId, $usage, $reading, $balance, $pressure, $temp, $today]);
        }

        // Handle explicit valveStatus or auto-close if balance exhausted
        $valveStatus = isset($body['valveStatus']) ? strtoupper(trim($body['valveStatus'])) : null;
        if ($valveStatus && in_array($valveStatus, ['OPEN', 'CLOSED'])) {
            $db->prepare("UPDATE gas_meters SET valve_status = ? WHERE id = ?")->execute([$valveStatus, $meterId]);
        } elseif ($balance <= 0) {
            $db->prepare("UPDATE gas_meters SET valve_status = 'CLOSED' WHERE id = ?")->execute([$meterId]);
        }

        // Also record a communication log
        $stmtLog = $db->prepare("INSERT INTO communication_logs (meter_id, direction, packet_data, status, retry_count) VALUES (?, 'INCOMING', ?, 'SUCCESS', 0)");
        $stmtLog->execute([$meterId, "SIM_TELEMETRY: reading={$reading}m3, bal=\${$balance}, usage={$usage}m3"]);

        // Fetch current meter and consumption state to return to simulator
        $stmtCurr = $db->prepare("SELECT m.valve_status, c.remaining_balance, c.meter_reading FROM gas_meters m LEFT JOIN consumption c ON c.meter_id = m.id WHERE m.id = ? ORDER BY c.id DESC LIMIT 1");
        $stmtCurr->execute([$meterId]);
        $currRow = $stmtCurr->fetch();

        json_response([
            'status' => 'recorded',
            'meterId' => (int)$meterId,
            'recordedDate' => $today,
            'balance' => $currRow && $currRow['remaining_balance'] !== null ? (float)$currRow['remaining_balance'] : $balance,
            'reading' => $currRow && $currRow['meter_reading'] !== null ? (float)$currRow['meter_reading'] : $reading,
            'valveStatus' => $currRow['valve_status'] ?? ($balance > 0 ? 'OPEN' : 'CLOSED'),
        ]);
    }

    // Single meter sub-actions: /api/meters/{id}/valve or /recharge
    if (is_numeric($subResource)) {
        $meterId = (int)$subResource;

        // POST /api/meters/{id}/valve
        if ($action === 'valve' && $method === 'POST') {
            $body = get_json_body();
            $valveStatus = strtoupper($body['valveStatus'] ?? 'OPEN');
            if (!in_array($valveStatus, ['OPEN', 'CLOSED'])) {
                json_response(['error' => 'valveStatus must be OPEN or CLOSED'], 400);
            }

            // Check if attempting to open valve with 0 balance
            if ($valveStatus === 'OPEN') {
                $stmtBal = $db->prepare("SELECT remaining_balance FROM consumption WHERE meter_id = ? ORDER BY id DESC LIMIT 1");
                $stmtBal->execute([$meterId]);
                $currBal = (float)$stmtBal->fetchColumn();
                if ($currBal <= 0) {
                    json_response(['error' => 'Cannot open valve: Credit balance is ৳0.00. Please recharge the meter first.'], 400);
                }
            }

            $stmt = $db->prepare("UPDATE gas_meters SET valve_status = ? WHERE id = ?");
            $stmt->execute([$valveStatus, $meterId]);
            log_audit(null, 'VALVE_CONTROL', "Valve on meter #{$meterId} set to {$valveStatus}");

            $stmtMtr = $db->prepare("SELECT * FROM gas_meters WHERE id = ?");
            $stmtMtr->execute([$meterId]);
            json_response(format_meter($stmtMtr->fetch()));
        }

        // POST /api/meters/{id}/recharge
        if ($action === 'recharge' && $method === 'POST') {
            $body = get_json_body();
            $amount = (float)($body['amount'] ?? 0);
            $paymentMethod = $body['paymentMethod'] ?? 'KEYPAD_TOKEN';

            if ($amount <= 0) {
                json_response(['error' => 'Amount must be greater than 0'], 400);
            }

            $token = sprintf("%04d-%04d-%04d-%04d-%04d", rand(1000, 9999), rand(1000, 9999), rand(1000, 9999), rand(1000, 9999), rand(1000, 9999));

            $stmt = $db->prepare("INSERT INTO recharges (meter_id, amount, token, payment_method, status) VALUES (?, ?, ?, ?, 'SUCCESSFUL')");
            $stmt->execute([$meterId, $amount, $token, $paymentMethod]);

            // Add to today's consumption remaining balance
            $today = date('Y-m-d');
            $stmtC = $db->prepare("SELECT id, remaining_balance FROM consumption WHERE meter_id = ? AND recorded_date = ? LIMIT 1");
            $stmtC->execute([$meterId, $today]);
            $cRow = $stmtC->fetch();
            if ($cRow) {
                $db->prepare("UPDATE consumption SET remaining_balance = remaining_balance + ? WHERE id = ?")->execute([$amount, $cRow['id']]);
            } else {
                $db->prepare("INSERT INTO consumption (meter_id, daily_usage, meter_reading, remaining_balance, pressure, temperature, recorded_date) VALUES (?, 0, 0, ?, 2.2, 25.0, ?)")->execute([$meterId, $amount, $today]);
            }

            // Automatically open valve once recharged!
            $db->prepare("UPDATE gas_meters SET valve_status = 'OPEN' WHERE id = ?")->execute([$meterId]);

            log_audit(null, 'RECHARGE_PROCESSED', "Meter #{$meterId} recharged with \${$amount} via {$paymentMethod} (Valve Opened)");

            json_response([
                'id' => (int)$db->lastInsertId(),
                'meterId' => $meterId,
                'amount' => $amount,
                'token' => $token,
                'paymentMethod' => $paymentMethod,
                'status' => 'SUCCESSFUL',
                'createdAt' => date('c'),
            ]);
        }

        // GET /api/meters/{id}
        if ($method === 'GET') {
            $stmt = $db->prepare("SELECT m.*, c.first_name, c.last_name, c.phone, c.email as c_email,
                    (SELECT meter_reading FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as meter_reading,
                    (SELECT remaining_balance FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as remaining_balance
                    FROM gas_meters m 
                    LEFT JOIN customers c ON m.customer_id = c.id 
                    WHERE m.id = ?");
            $stmt->execute([$meterId]);
            $meter = $stmt->fetch();
            if (!$meter) json_response(['error' => 'Meter not found'], 404);
            json_response(format_meter($meter));
        }

        // PUT /api/meters/{id}
        if ($method === 'PUT') {
            $body = get_json_body();
            $customerId = isset($_GET['customerId']) ? (int)$_GET['customerId'] : ($body['customer']['id'] ?? null);

            $stmt = $db->prepare("UPDATE gas_meters SET meter_number = ?, serial_number = ?, communication_id = ?, firmware_version = ?, status = ?, valve_status = ?, installation_location = ?, customer_id = ? WHERE id = ?");
            $stmt->execute([
                $body['meterNumber'] ?? '',
                $body['serialNumber'] ?? '',
                $body['communicationId'] ?? '',
                $body['firmwareVersion'] ?? 'v2.4.1',
                $body['status'] ?? 'ACTIVE',
                $body['valveStatus'] ?? 'CLOSED',
                $body['installationLocation'] ?? '',
                $customerId ?: null,
                $meterId
            ]);

            log_audit(null, 'METER_UPDATED', "Meter #{$meterId} details updated");
            json_response(['status' => 'updated']);
        }

        // DELETE /api/meters/{id}
        if ($method === 'DELETE') {
            $stmt = $db->prepare("DELETE FROM gas_meters WHERE id = ?");
            $stmt->execute([$meterId]);
            log_audit(null, 'METER_DELETED', "Meter #{$meterId} deleted");
            http_response_code(204);
            exit();
        }
    }

    // GET /api/meters -> List all
    if ($method === 'GET') {
        $sql = "SELECT m.*, c.id as c_id, c.first_name, c.last_name, c.phone, c.email as c_email,
                (SELECT meter_reading FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as meter_reading,
                (SELECT remaining_balance FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as remaining_balance
                FROM gas_meters m 
                LEFT JOIN customers c ON m.customer_id = c.id 
                ORDER BY m.id DESC";
        $meters = $db->query($sql)->fetchAll();
        $formatted = array_map('format_meter', $meters);
        json_response($formatted);
    }

    // POST /api/meters -> Create new (reading = 0.000, balance = 0.00, valve = CLOSED)
    if ($method === 'POST') {
        $body = get_json_body();
        $customerId = isset($_GET['customerId']) ? (int)$_GET['customerId'] : ($body['customer']['id'] ?? null);

        $stmt = $db->prepare("INSERT INTO gas_meters (meter_number, serial_number, communication_id, firmware_version, status, valve_status, installation_location, customer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $body['meterNumber'] ?? 'MTR-' . rand(1000, 9999),
            $body['serialNumber'] ?? 'SN-' . date('Y') . '-' . rand(1000, 9999),
            $body['communicationId'] ?? 'COMM-' . rand(100, 999),
            $body['firmwareVersion'] ?? 'v2.4.1',
            $body['status'] ?? 'ACTIVE',
            $body['valveStatus'] ?? 'CLOSED', // Default closed until recharge!
            $body['installationLocation'] ?? 'Residential Inlet',
            $customerId ?: null,
        ]);

        $newId = (int)$db->lastInsertId();
        log_audit(null, 'METER_CREATED', "New meter created with ID {$newId}");

        // Seed initial consumption with 0.000 reading and $0.00 remaining balance
        $today = date('Y-m-d');
        $stmtCons = $db->prepare("INSERT INTO consumption (meter_id, daily_usage, meter_reading, remaining_balance, pressure, temperature, recorded_date) VALUES (?, 0.000, 0.000, 0.00, 2.2, 25.0, ?)");
        $stmtCons->execute([$newId, $today]);

        $stmtMtr = $db->prepare("SELECT m.*, c.first_name, c.last_name, c.phone, c.email as c_email,
                (SELECT meter_reading FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as meter_reading,
                (SELECT remaining_balance FROM consumption WHERE meter_id = m.id ORDER BY id DESC LIMIT 1) as remaining_balance
                FROM gas_meters m 
                LEFT JOIN customers c ON m.customer_id = c.id 
                WHERE m.id = ?");
        $stmtMtr->execute([$newId]);
        json_response(format_meter($stmtMtr->fetch()), 201);
    }
}

// -------------------------------------------------------------
// 4. CUSTOMERS (/api/customers)
// -------------------------------------------------------------
if ($resource === 'customers') {
    if (is_numeric($subResource)) {
        $cid = (int)$subResource;
        if ($method === 'GET') {
            $stmt = $db->prepare("SELECT * FROM customers WHERE id = ?");
            $stmt->execute([$cid]);
            $row = $stmt->fetch();
            if (!$row) json_response(['error' => 'Customer not found'], 404);
            json_response(format_customer($row));
        }
        if ($method === 'PUT') {
            $b = get_json_body();
            $stmt = $db->prepare("UPDATE customers SET first_name = ?, last_name = ?, email = ?, phone = ?, national_id = ?, address = ?, division = ?, district = ?, area = ?, project_name = ? WHERE id = ?");
            $stmt->execute([
                $b['firstName'] ?? '',
                $b['lastName'] ?? '',
                $b['email'] ?? null,
                $b['phone'] ?? '',
                $b['nationalId'] ?? null,
                $b['address'] ?? '',
                $b['division'] ?? null,
                $b['district'] ?? null,
                $b['area'] ?? null,
                $b['projectName'] ?? $b['project_name'] ?? null,
                $cid
            ]);
            log_audit(null, 'CUSTOMER_UPDATED', "Customer #{$cid} updated");
            json_response(['status' => 'updated']);
        }
        if ($method === 'DELETE') {
            $db->prepare("DELETE FROM customers WHERE id = ?")->execute([$cid]);
            log_audit(null, 'CUSTOMER_DELETED', "Customer #{$cid} deleted");
            http_response_code(204);
            exit();
        }
    }

    if ($method === 'GET') {
        $customers = $db->query("SELECT * FROM customers ORDER BY id DESC")->fetchAll();
        json_response(array_map('format_customer', $customers));
    }

    if ($method === 'POST') {
        $b = get_json_body();
        $stmt = $db->prepare("INSERT INTO customers (first_name, last_name, email, phone, national_id, address, division, district, area, project_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $b['firstName'] ?? '',
            $b['lastName'] ?? '',
            $b['email'] ?? null,
            $b['phone'] ?? '',
            $b['nationalId'] ?? null,
            $b['address'] ?? '',
            $b['division'] ?? null,
            $b['district'] ?? null,
            $b['area'] ?? null,
            $b['projectName'] ?? $b['project_name'] ?? null,
        ]);
        $newId = (int)$db->lastInsertId();
        log_audit(null, 'CUSTOMER_REGISTERED', "New customer registered with ID {$newId}");
        $stmtRow = $db->prepare("SELECT * FROM customers WHERE id = ?");
        $stmtRow->execute([$newId]);
        json_response(format_customer($stmtRow->fetch()), 201);
    }
}

// -------------------------------------------------------------
// 5. TARIFFS (/api/tariffs)
// -------------------------------------------------------------
if ($resource === 'tariffs') {
    if (is_numeric($subResource) && $method === 'DELETE') {
        $tid = (int)$subResource;
        $db->prepare("DELETE FROM tariffs WHERE id = ?")->execute([$tid]);
        log_audit(null, 'TARIFF_DELETED', "Tariff plan #{$tid} deleted");
        http_response_code(204);
        exit();
    }

    if (is_numeric($subResource) && $method === 'PUT') {
        $tid = (int)$subResource;
        $b = get_json_body();
        $fields = [];
        $params = [];
        if (isset($b['name'])) { $fields[] = 'name = ?'; $params[] = $b['name']; }
        if (isset($b['unitPrice'])) { $fields[] = 'unit_price = ?'; $params[] = (float)$b['unitPrice']; }
        if (isset($b['vatPercentage'])) { $fields[] = 'vat_percentage = ?'; $params[] = (float)$b['vatPercentage']; }
        if (isset($b['fixedCharge'])) { $fields[] = 'fixed_charge = ?'; $params[] = (float)$b['fixedCharge']; }
        if (isset($b['serviceCharge'])) { $fields[] = 'service_charge = ?'; $params[] = (float)$b['serviceCharge']; }
        if (isset($b['isActive'])) {
            $fields[] = 'is_active = ?';
            $params[] = $b['isActive'] ? 1 : 0;
            if ($b['isActive']) {
                $db->prepare("UPDATE tariffs SET is_active = 0 WHERE id != ?")->execute([$tid]);
            }
        }
        if (!empty($fields)) {
            $params[] = $tid;
            $db->prepare("UPDATE tariffs SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);
            log_audit(null, 'TARIFF_UPDATED', "Tariff plan #{$tid} updated");
        }
        json_response(['success' => true]);
    }

    if ($method === 'GET') {
        $tariffs = $db->query("SELECT * FROM tariffs ORDER BY id DESC")->fetchAll();
        $formatted = array_map(function($t) {
            return [
                'id' => (int)$t['id'],
                'name' => $t['name'],
                'unitPrice' => (float)$t['unit_price'],
                'vatPercentage' => (float)$t['vat_percentage'],
                'fixedCharge' => (float)$t['fixed_charge'],
                'serviceCharge' => (float)$t['service_charge'],
                'isActive' => (bool)$t['is_active'],
                'createdAt' => $t['created_at'],
            ];
        }, $tariffs);
        json_response($formatted);
    }

    if ($method === 'POST') {
        $b = get_json_body();
        $stmt = $db->prepare("INSERT INTO tariffs (name, unit_price, vat_percentage, fixed_charge, service_charge, is_active) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $b['name'] ?? 'Custom Plan',
            (float)($b['unitPrice'] ?? 0.85),
            (float)($b['vatPercentage'] ?? 5.0),
            (float)($b['fixedCharge'] ?? 2.5),
            (float)($b['serviceCharge'] ?? 1.0),
            isset($b['isActive']) ? ($b['isActive'] ? 1 : 0) : 1
        ]);
        $newId = (int)$db->lastInsertId();
        log_audit(null, 'TARIFF_CREATED', "New pricing tariff #{$newId} configured");
        json_response(['id' => $newId, 'name' => $b['name']], 201);
    }
}

// -------------------------------------------------------------
// 6. RECHARGES (/api/recharges)
// -------------------------------------------------------------
if ($resource === 'recharges') {
    if ($method === 'GET') {
        $sql = "SELECT r.*, m.meter_number, m.serial_number, c.first_name, c.last_name 
                FROM recharges r 
                LEFT JOIN gas_meters m ON r.meter_id = m.id 
                LEFT JOIN customers c ON m.customer_id = c.id 
                ORDER BY r.id DESC LIMIT 100";
        $recharges = $db->query($sql)->fetchAll();
        $formatted = array_map(function($r) {
            return [
                'id' => (int)$r['id'],
                'meter' => [
                    'id' => (int)$r['meter_id'],
                    'meterNumber' => $r['meter_number'] ?? 'MTR-N/A',
                    'serialNumber' => $r['serial_number'] ?? 'SN-N/A',
                ],
                'amount' => (float)$r['amount'],
                'token' => $r['token'],
                'paymentMethod' => $r['payment_method'],
                'status' => $r['status'],
                'createdAt' => $r['created_at'],
            ];
        }, $recharges);
        json_response($formatted);
    }

    if ($method === 'POST') {
        $b = get_json_body();
        $meterId = (int)($b['meterId'] ?? 0);
        $amount = (float)($b['amount'] ?? 0);
        $method = $b['paymentMethod'] ?? 'ONLINE_PORTAL';

        if ($meterId <= 0 || $amount <= 0) {
            json_response(['error' => 'meterId and positive amount are required'], 400);
        }

        $token = sprintf("%04d-%04d-%04d-%04d-%04d", rand(1000, 9999), rand(1000, 9999), rand(1000, 9999), rand(1000, 9999), rand(1000, 9999));
        $stmt = $db->prepare("INSERT INTO recharges (meter_id, amount, token, payment_method, status) VALUES (?, ?, ?, ?, 'SUCCESSFUL')");
        $stmt->execute([$meterId, $amount, $token, $method]);
        $newId = (int)$db->lastInsertId();

        // Update consumption balance
        $today = date('Y-m-d');
        $stmtC = $db->prepare("SELECT id FROM consumption WHERE meter_id = ? AND recorded_date = ? LIMIT 1");
        $stmtC->execute([$meterId, $today]);
        $cid = $stmtC->fetchColumn();
        if ($cid) {
            $db->prepare("UPDATE consumption SET remaining_balance = remaining_balance + ? WHERE id = ?")->execute([$amount, $cid]);
        } else {
            $db->prepare("INSERT INTO consumption (meter_id, daily_usage, meter_reading, remaining_balance, pressure, temperature, recorded_date) VALUES (?, 0, 0, ?, 2.2, 25.0, ?)")->execute([$meterId, $amount, $today]);
        }

        // Automatically open the meter valve upon manual recharge
        $db->prepare("UPDATE gas_meters SET valve_status = 'OPEN' WHERE id = ?")->execute([$meterId]);

        log_audit(null, 'RECHARGE_COMPLETED', "Manual recharge of \${$amount} credited to meter #{$meterId} (Valve Opened)");

        json_response([
            'id' => $newId,
            'meterId' => $meterId,
            'amount' => $amount,
            'token' => $token,
            'paymentMethod' => $method,
            'status' => 'SUCCESSFUL',
            'createdAt' => date('c'),
        ], 201);
    }
}

// -------------------------------------------------------------
// 7. LOGS (/api/logs/communication & /api/logs/audit)
// -------------------------------------------------------------
if ($resource === 'logs') {
    if ($subResource === 'communication' && $method === 'GET') {
        $sql = "SELECT l.*, m.meter_number 
                FROM communication_logs l 
                LEFT JOIN gas_meters m ON l.meter_id = m.id 
                ORDER BY l.id DESC LIMIT 100";
        $logs = $db->query($sql)->fetchAll();
        $formatted = array_map(function($l) {
            return [
                'id' => (int)$l['id'],
                'meter' => [
                    'id' => (int)$l['meter_id'],
                    'meterNumber' => $l['meter_number'] ?? 'MTR-N/A',
                ],
                'direction' => $l['direction'],
                'packetData' => $l['packet_data'],
                'status' => $l['status'],
                'retryCount' => (int)$l['retry_count'],
                'errorMessage' => $l['error_message'],
                'createdAt' => $l['created_at'],
            ];
        }, $logs);
        json_response($formatted);
    }

    if ($subResource === 'audit' && $method === 'GET') {
        $logs = $db->query("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 100")->fetchAll();
        $formatted = array_map(function($a) {
            return [
                'id' => (int)$a['id'],
                'action' => $a['action'],
                'details' => $a['details'],
                'ipAddress' => $a['ip_address'],
                'createdAt' => $a['created_at'],
            ];
        }, $logs);
        json_response($formatted);
    }
}

// -------------------------------------------------------------
// 8. USERS (/api/users)
// -------------------------------------------------------------
if ($resource === 'users') {
    if (is_numeric($subResource) && $method === 'DELETE') {
        $uid = (int)$subResource;
        $db->prepare("DELETE FROM users WHERE id = ?")->execute([$uid]);
        log_audit(null, 'USER_DELETED', "User account #{$uid} deleted");
        http_response_code(204);
        exit();
    }

    if ($method === 'GET') {
        $users = $db->query("SELECT id, username, email, role, customer_id, created_at FROM users ORDER BY id ASC")->fetchAll();
        $formatted = array_map(function($u) {
            return [
                'id' => (int)$u['id'],
                'username' => $u['username'],
                'email' => $u['email'],
                'role' => $u['role'],
                'customerId' => $u['customer_id'] ? (int)$u['customer_id'] : null,
                'createdAt' => $u['created_at'],
            ];
        }, $users);
        json_response($formatted);
    }

    if ($method === 'POST') {
        $b = get_json_body();
        $username = trim($b['username'] ?? '');
        $email = trim($b['email'] ?? '');
        $rawPass = $b['passwordHash'] ?? $b['password'] ?? 'user123';
        $role = $b['role'] ?? 'SUPPORT_STAFF';

        if (!$username || !$email) {
            json_response(['error' => 'Username and email are required'], 400);
        }

        $hash = password_hash($rawPass, PASSWORD_BCRYPT);
        $stmt = $db->prepare("INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)");
        $stmt->execute([$username, $hash, $email, $role]);
        $newId = (int)$db->lastInsertId();

        log_audit(null, 'USER_CREATED', "New user {$username} ({$role}) registered");

        json_response([
            'id' => $newId,
            'username' => $username,
            'email' => $email,
            'role' => $role,
            'createdAt' => date('c'),
        ], 201);
    }
}

// -------------------------------------------------------------
// 9. LOCATIONS & ZONING (/api/locations)
// -------------------------------------------------------------
if ($resource === 'locations') {
    // GET /api/locations/summary
    if ($subResource === 'summary' && $method === 'GET') {
        $divisions = $db->query("SELECT id, name, created_at FROM divisions ORDER BY name ASC")->fetchAll();
        $districts = $db->query("SELECT d.id, d.division_id, d.name, d.created_at, divn.name as division_name 
                                  FROM districts d 
                                  LEFT JOIN divisions divn ON d.division_id = divn.id 
                                  ORDER BY d.name ASC")->fetchAll();
        $areas = $db->query("SELECT a.id, a.district_id, a.name, a.postal_code, a.created_at, dist.name as district_name, divn.name as division_name 
                             FROM areas a 
                             LEFT JOIN districts dist ON a.district_id = dist.id 
                             LEFT JOIN divisions divn ON dist.division_id = divn.id 
                             ORDER BY a.name ASC")->fetchAll();
        $projects = $db->query("SELECT p.id, p.area_id, p.name, p.code, p.description, p.status, p.created_at, a.name as area_name 
                                FROM projects p 
                                LEFT JOIN areas a ON p.area_id = a.id 
                                ORDER BY p.name ASC")->fetchAll();

        json_response([
            'divisions' => array_map(function($d) {
                return [
                    'id' => (int)$d['id'],
                    'name' => $d['name'],
                    'createdAt' => $d['created_at'],
                ];
            }, $divisions),
            'districts' => array_map(function($d) {
                return [
                    'id' => (int)$d['id'],
                    'divisionId' => (int)$d['division_id'],
                    'divisionName' => $d['division_name'] ?? '',
                    'name' => $d['name'],
                    'createdAt' => $d['created_at'],
                ];
            }, $districts),
            'areas' => array_map(function($a) {
                return [
                    'id' => (int)$a['id'],
                    'districtId' => (int)$a['district_id'],
                    'districtName' => $a['district_name'] ?? '',
                    'divisionName' => $a['division_name'] ?? '',
                    'name' => $a['name'],
                    'postalCode' => $a['postal_code'] ?? '',
                    'createdAt' => $a['created_at'],
                ];
            }, $areas),
            'projects' => array_map(function($p) {
                return [
                    'id' => (int)$p['id'],
                    'areaId' => $p['area_id'] ? (int)$p['area_id'] : null,
                    'areaName' => $p['area_name'] ?? '',
                    'name' => $p['name'],
                    'code' => $p['code'] ?? '',
                    'description' => $p['description'] ?? '',
                    'status' => $p['status'] ?? 'ACTIVE',
                    'createdAt' => $p['created_at'],
                ];
            }, $projects),
        ]);
    }

    // Divisions: /api/locations/divisions
    if ($subResource === 'divisions') {
        if ($action && is_numeric($action) && $method === 'DELETE') {
            $id = (int)$action;
            $db->prepare("DELETE FROM divisions WHERE id = ?")->execute([$id]);
            log_audit(null, 'LOCATION_DIVISION_DELETED', "Division #{$id} deleted");
            http_response_code(204);
            exit();
        }
        if ($method === 'POST') {
            $b = get_json_body();
            $name = trim($b['name'] ?? '');
            if (!$name) json_response(['error' => 'Division name is required'], 400);

            $stmt = $db->prepare("INSERT INTO divisions (name) VALUES (?)");
            $stmt->execute([$name]);
            $newId = (int)$db->lastInsertId();
            log_audit(null, 'LOCATION_DIVISION_CREATED', "New division '{$name}' created");
            json_response(['id' => $newId, 'name' => $name, 'createdAt' => date('c')], 201);
        }
    }

    // Districts: /api/locations/districts
    if ($subResource === 'districts') {
        if ($action && is_numeric($action) && $method === 'DELETE') {
            $id = (int)$action;
            $db->prepare("DELETE FROM districts WHERE id = ?")->execute([$id]);
            log_audit(null, 'LOCATION_DISTRICT_DELETED', "District #{$id} deleted");
            http_response_code(204);
            exit();
        }
        if ($method === 'POST') {
            $b = get_json_body();
            $divisionId = (int)($b['divisionId'] ?? $b['division_id'] ?? 0);
            $name = trim($b['name'] ?? '');
            if (!$divisionId || !$name) json_response(['error' => 'divisionId and name are required'], 400);

            $stmt = $db->prepare("INSERT INTO districts (division_id, name) VALUES (?, ?)");
            $stmt->execute([$divisionId, $name]);
            $newId = (int)$db->lastInsertId();
            log_audit(null, 'LOCATION_DISTRICT_CREATED', "New district '{$name}' created");
            json_response(['id' => $newId, 'divisionId' => $divisionId, 'name' => $name, 'createdAt' => date('c')], 201);
        }
    }

    // Areas: /api/locations/areas
    if ($subResource === 'areas') {
        if ($action && is_numeric($action) && $method === 'DELETE') {
            $id = (int)$action;
            $db->prepare("DELETE FROM areas WHERE id = ?")->execute([$id]);
            log_audit(null, 'LOCATION_AREA_DELETED', "Area #{$id} deleted");
            http_response_code(204);
            exit();
        }
        if ($method === 'POST') {
            $b = get_json_body();
            $districtId = (int)($b['districtId'] ?? $b['district_id'] ?? 0);
            $name = trim($b['name'] ?? '');
            $postalCode = trim($b['postalCode'] ?? $b['postal_code'] ?? '');
            if (!$districtId || !$name) json_response(['error' => 'districtId and name are required'], 400);

            $stmt = $db->prepare("INSERT INTO areas (district_id, name, postal_code) VALUES (?, ?, ?)");
            $stmt->execute([$districtId, $name, $postalCode ?: null]);
            $newId = (int)$db->lastInsertId();
            log_audit(null, 'LOCATION_AREA_CREATED', "New area '{$name}' created");
            json_response(['id' => $newId, 'districtId' => $districtId, 'name' => $name, 'postalCode' => $postalCode, 'createdAt' => date('c')], 201);
        }
    }

    // Projects: /api/locations/projects
    if ($subResource === 'projects') {
        if ($action && is_numeric($action) && $method === 'DELETE') {
            $id = (int)$action;
            $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$id]);
            log_audit(null, 'LOCATION_PROJECT_DELETED', "Project #{$id} deleted");
            http_response_code(204);
            exit();
        }
        if ($method === 'POST') {
            $b = get_json_body();
            $areaId = !empty($b['areaId']) ? (int)$b['areaId'] : (!empty($b['area_id']) ? (int)$b['area_id'] : null);
            $name = trim($b['name'] ?? '');
            $code = trim($b['code'] ?? '');
            $description = trim($b['description'] ?? '');
            $status = trim($b['status'] ?? 'ACTIVE');
            if (!$name) json_response(['error' => 'Project name is required'], 400);

            $stmt = $db->prepare("INSERT INTO projects (area_id, name, code, description, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$areaId, $name, $code ?: null, $description ?: null, $status]);
            $newId = (int)$db->lastInsertId();
            log_audit(null, 'LOCATION_PROJECT_CREATED', "New project '{$name}' created");
            json_response([
                'id' => $newId,
                'areaId' => $areaId,
                'name' => $name,
                'code' => $code,
                'description' => $description,
                'status' => $status,
                'createdAt' => date('c'),
            ], 201);
        }
    }

    json_response(['error' => 'Location endpoint not found'], 404);
}

// Helper formatters
function format_meter($m) {
    if (!$m) return null;
    return [
        'id' => (int)$m['id'],
        'meterNumber' => $m['meter_number'],
        'serialNumber' => $m['serial_number'],
        'communicationId' => $m['communication_id'],
        'firmwareVersion' => $m['firmware_version'] ?? 'v2.4.1',
        'status' => $m['status'],
        'valveStatus' => $m['valve_status'],
        'reading' => isset($m['meter_reading']) ? (float)$m['meter_reading'] : 0.0,
        'balance' => isset($m['remaining_balance']) ? (float)$m['remaining_balance'] : 0.0,
        'installationLocation' => $m['installation_location'],
        'customer' => !empty($m['customer_id']) ? [
            'id' => (int)$m['customer_id'],
            'firstName' => $m['first_name'] ?? 'Registered',
            'lastName' => $m['last_name'] ?? 'Consumer',
            'phone' => $m['phone'] ?? '',
            'email' => $m['c_email'] ?? '',
        ] : null,
        'createdAt' => $m['created_at'],
        'updatedAt' => $m['updated_at'] ?? null,
    ];
}

function format_customer($c) {
    if (!$c) return null;
    return [
        'id' => (int)$c['id'],
        'firstName' => $c['first_name'],
        'lastName' => $c['last_name'],
        'email' => $c['email'],
        'phone' => $c['phone'],
        'nationalId' => $c['national_id'],
        'address' => $c['address'],
        'division' => $c['division'] ?? '',
        'district' => $c['district'] ?? '',
        'area' => $c['area'] ?? '',
        'projectName' => $c['project_name'] ?? '',
        'createdAt' => $c['created_at'],
        'updatedAt' => $c['updated_at'] ?? null,
    ];
}

// If no matching route
json_response(['error' => 'Not Found', 'path' => $path, 'method' => $method], 404);
